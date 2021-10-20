<template>
  <div class="game-container">
    <div :class="['tips-box', {show: gameOver}]">
      <div class="content">GameOver</div>
    </div>
    <div class="time">游戏已进行：{{gameTime}}s</div>
    <div class="gold">已得分：{{getGold}}分</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRaw, onMounted, ref, computed } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import * as THREE from 'three';
// import bgPic from '../assets/game/disturb.jpg'
// import boxPic from '../assets/game/crate.png'

export default defineComponent({
  setup() {
    const initJumpHeight = 40 // 人物每次跳动的高度
    const jumpNum = 2 // 允许人物在空中跳跃的次数
    let timer = null // 定时器
    let backTimer = null // ⏲
    const getGold = ref(0) // 得到的分数
    const isRise = ref(false)
    const groundNum = ref(5) // 地板的块数 规格 100*100
    const initSpaceBox = ref(300) // 障碍物初始化x方向位置 食物也共用这个
    const minSpaceBox = ref (70) // 障碍物最小间距 包含障碍物宽度 50 间距 + 20宽度
    const maxSpaceBox = ref (250) // 障碍物最大间距  食物也共用这个
    const removeSpaceBox = ref(-250) // 障碍物移除边界
    const maxSpaceGold = ref (250) // 食物最大间距
    const maxSpaceGoldY = ref (80) // 食物Y轴最大间距
    const removeSpaceGround = ref(-200) // 地面物移除边界
    const jumpHeight = ref(initJumpHeight) // 本次人物跳动的高度
    const jumpNumed = ref(0) // 任务本次跳跃已跳跃次数
    const gameOver = ref(false) // 游戏是否结束 发生碰撞
    const speed = ref(1) // 速度
    const gameTime = ref(0) // 游戏进行时间
    const manMeshSize = ref(null) // 人物模型的尺寸

    const sidesList = [
      {
        url: 'src/assets/pic/1.png',
        position: [ -512, 0, 0 ],
        rotation: [ 0, Math.PI / 2, 0 ]
      },
      {
        url: 'src/assets/pic/2.png',
        position: [ 512, 0, 0 ],
        rotation: [ 0, -Math.PI / 2, 0 ]
      },
      {
        url: 'src/assets/pic/3.png',
        position: [ 0,  512, 0 ],
        rotation: [ Math.PI / 2, 0, Math.PI ]
      },
      {
        url: 'src/assets/pic/4.png',
        position: [ 0, -512, 0 ],
        rotation: [ - Math.PI / 2, 0, Math.PI ]
      },
      {
        url: 'src/assets/pic/5.png',
        position: [ 0, 0,  512 ],
        rotation: [ 0, Math.PI, 0 ]
      },
      {
        url: 'src/assets/pic/6.png',
        position: [ 0, 0, -512 ],
        rotation: [ 0, 0, 0 ]
      }
    ];

    /**
     * @info 障碍物在地面上最多存在的个数
     */
    const maxNumBox = computed(() => {
      return Math.floor((initSpaceBox.value - removeSpaceBox.value) / minSpaceBox.value)
    })

    /**
     * @info 地板动画
     */
    const meshGroundAnimate = (list) => {
      list.forEach(modal => {
        modal.translateX(-1 * speed.value)
      })
      if (list[0].position.x <= removeSpaceGround.value) {
        const position = list[list.length - 1].position.x
        const modal = list.shift()
        modal.position.x = position + 100
        list.push(modal)
      }
    }

    /**
     * @info 障碍物动画
     */
    const meshBoxAnimate = (boxList, boxFreeList) => {
      boxList.forEach(box => {
        box.translateX(-1 * speed.value)
      })
      if (boxList.length < maxNumBox.value) {
        const x = boxList[boxList.length - 1].position.x
        if (x - minSpaceBox.value < initSpaceBox.value ) { // 判断最后一个障碍物的位置
          const newBoxSpace = Math.floor(Math.random()*(maxSpaceBox.value - minSpaceBox.value + 1 ) + minSpaceBox.value) // 和上一个障碍物的间距
          const newBox = boxFreeList.shift()
          // console.log(newBox, '---')
          newBox.position.x = x + newBoxSpace
          boxList.push(newBox)
        }
      }
      if (boxList.length && boxList[0].position.x < removeSpaceBox.value) { // 过边界移除
        const moveBox = boxList.shift()
        boxFreeList.push(moveBox)
      }
    }

    /**
     * @info 食物动画
     */
    const goldMeshAnimate = (goldList, goldMesh, scene) => {
      if(goldMesh.value) {
        goldList.forEach(box => {
          box.translateX(-1 * speed.value)
        })
        // 回收机制
        if (goldList.length && goldList[0].position.x < removeSpaceBox.value) { // 过边界移除
          const moveBox = goldList.shift()
          scene.remove(moveBox)
        }
        // 生成机制
        const x = goldList.length > 0 ? goldList[goldList.length - 1].position.x : 0
        if (initSpaceBox.value - x > 20)  {
          const newBoxSpace = Math.floor(Math.random()*maxSpaceGold.value + 1) // 和上一个食物的间距
          const newBoxSpaceY = Math.floor(Math.random()*maxSpaceGoldY.value + 1) // 和上一个食物的间距
          const newGoldMesh = goldMesh.value.clone()
          newGoldMesh.position.x = x + newBoxSpace
          newGoldMesh.position.y = newBoxSpaceY
          goldList.push(newGoldMesh)
          scene.add(newGoldMesh)
        }
      }
    }

    /**
     * @info 人物动画
     */
    const meshManAnimate = (modal) => {
      if (modal) {
        if (modal.position.y > 0 && isRise.value === false) { // 下降
          // const Math.sqrt(x)
          let y = Number(Math.sqrt(Math.abs(  -1 * jumpHeight.value - modal.position.y)).toFixed(2))
          y = y > 1 ? y : 1
          modal.translateY(y * -0.4)
        } else if (modal.position.y <= jumpHeight.value && isRise.value === true) { // 上升
          let y = Number(Math.sqrt(Math.abs(jumpHeight.value - modal.position.y)).toFixed(2))
          y = y > 1 ? y : 1
          modal.translateY(y * 0.4)
        } else if (modal.position.y <= 0 && isRise.value === false && jumpNumed.value !== 0) { // 人物模型跳跃结束
          modal.position.y = 0
          jumpHeight.value = initJumpHeight // 还原高度
          jumpNumed.value = 0
        } else if (modal.position.y >= jumpHeight.value && isRise.value === true) { // 开始下降
          isRise.value = false
        }
      }
    }



    // ================游戏功能
    /**
     * @info 判断是否发生碰撞 游戏结束
     */
    const isGameOver = (meshMan, boxList) => {
      const meshBox = boxList.find(val => val.position.x <= 10 && val.position.x > -10) // 10 是障碍物宽度1/2
      if (meshBox && meshMan.position.y < 20) { // 20障碍物的高度
        gameOver.value = true
        clearTimer()
      }
    }

    /**
     * @info 人物是否吃食物
     */
    const isEat = (meshMan, goldList, scene) => {
      if (manMeshSize.value) {
        const meshBox = goldList.find(val => val.position.x <= 10 && val.position.x > -10) // 10 是障碍物宽度1/2
        if (meshBox) {
          const max = manMeshSize.value.max.y + meshMan.position.y
          const min = meshMan.position.y
          if (meshBox.position.y <= max && meshBox.position.y >= min ) {
            scene.remove(meshBox)
            const idx = goldList.findIndex(val => val.uuid === meshBox.uuid)
            goldList.splice(idx,1)
            ++getGold.value
          }
        }
      }
    }


    /**
     * @info 检测食物与障碍物是否发生碰撞 如果发生碰撞 则移动食物
     */   
    const handleCheck = (boxList, goldList) => {
      const box = boxList.filter(val => val.position.x >= initSpaceBox.value - 20) // 多来一点（20）
      const gold = goldList.filter(val => val.position.x >= initSpaceBox.value - 20) // 多来一点（20）
      gold.forEach((val) => {
        box.forEach(items => {
          if (val.position.x < items.position.x + 40 && val.position.x > items.position.x - 40 && val.position.y <= 30) {
            val.position.y = 60
          }
        })
      })
    }

    /**
     * @info 随着时间推移 速度越来越快
     */   
    const openTimer = () => {
      timer = setInterval(() => {
        speed.value = speed.value + 0.1
        if(speed.value >= 2) {
          clearTimer()
        }
      }, 10000);
    }

    /**
     * @info 游戏进行时间
     */  
    const liveTime = () => {
      backTimer = setInterval(() => {
        ++gameTime.value
      }, 1000)
    }

    const clearTimer = () => {
      clearInterval(timer)
      clearInterval(backTimer)
      timer = null
      backTimer = null
    }

    /**
     * @info 生成模型
     */ 
    const creatModal = (scene) => {
      // 地面模型
      var texture = new THREE.TextureLoader();
      var geometryGround = new THREE.PlaneGeometry(100, 100)
      const img = texture.load('src/assets/game/disturb.jpg')
			var materialGround = new THREE.MeshLambertMaterial({
				map: img,
			})
      
      const meshGround = new THREE.Mesh(geometryGround, materialGround)
      meshGround.rotateX(Math.PI * 3/2)
      meshGround.translateY(-50)
      const meshGroundPrev = meshGround.clone().translateX(-100)
      const meshGroundPrev1 = meshGround.clone().translateX(-200)
      const meshGroundNext = meshGround.clone().translateX(100)
      const meshGroundNext1 = meshGround.clone().translateX(200)

      // 障碍物
      var geometryBox = new THREE.BoxGeometry(20, 20, 50)
      const imgboxPic = texture.load('src/assets/game/crate.png')
      var materialyBox  = new THREE.MeshLambertMaterial({
				map: imgboxPic,
			})
      const meshBox = new THREE.Mesh(geometryBox, materialyBox)
      meshBox.position.x = initSpaceBox.value
      meshBox.translateY(10)
      meshBox.translateZ(50)
      
      // 吃了可得分的模型
      const goldMesh = ref(null)
      const loader = new FBXLoader()
      loader.load('src/assets/game/hat-fruit/source/HatFruit/HatFruitAdult.fbx', function(object) {
        object.traverse( function ( child ) {
          if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
            var loader = new THREE.TextureLoader();
            loader.load(
              'src/assets/game/hat-fruit/source/HatFruit/HatFruit01_TEX_RGB.png',   // 本地路径的图片
              // 加载完贴图后的回调函数
              function (texture) {
                  child.material.map = texture;
                  child.material.needsUpdate = true;
                  console.log("贴图更新完毕");
              },
              // 目前不支持加载贴图过程中的回调函数
              undefined,
              // 加载出错时候的回调函数
              function (err) {
                  console.error('An error happened.');
              }
            );
          }

        });
        object.position.z = 50
        object.scale.set(0.01, 0.01, 0.01)
        goldMesh.value = object
        // scene.add( object );
      })

      
      // 人物模型
      const manMesh = ref(null)
      // const loader = new FBXLoader()
      loader.load('src/assets/game/manModal/YY/YY.fbx', function(mesh) {
        mesh.traverse(function(child) {
          if(child.isMesh) {
            var loader = new THREE.TextureLoader();
              loader.load(
                'src/assets/game/manModal/YY/KS002_Megumin.png',   // 本地路径的图片
                // 加载完贴图后的回调函数
                function (texture) {
                    child.material.map = texture;
                    child.material.needsUpdate = true;
                    console.log("身体贴图更新完毕");
                },
                // 目前不支持加载贴图过程中的回调函数
                undefined,
                // 加载出错时候的回调函数
                function (err) {
                    console.error('An error happened.');
                }
              );
          }
        })
        manMesh.value = mesh
        mesh.scale.set(30, 30, 30)
        mesh.rotateY(Math.PI * 1/2)
        mesh.position.z = 50
        scene.add(mesh)
        manMeshSize.value = new THREE.Box3().setFromObject(mesh);
        // mesh.translateY(-80);
        // mesh作为参数创建一个混合器，解析播放mesh及其子对象包含的动画数据
        // mixer = new THREE.AnimationMixer(mesh);
        // 查看动画数据
        // console.log(mesh.animations)
        // mesh.animations[0]：获得剪辑对象clip
        // var AnimationAction=mixer.clipAction(mesh.animations[0]);
        // AnimationAction.timeScale = 1; //默认1，可以调节播放速度
        // AnimationAction.loop = THREE.LoopOnce; //不循环播放
        // AnimationAction.clampWhenFinished=true;//暂停在最后一帧播放的状态
        // AnimationAction.play();//播放动画
      })
      return {
        meshGround,
        meshGroundPrev,
        meshGroundPrev1,
        meshGroundNext,
        meshGroundNext1,
        meshBox,
        manMesh,
        goldMesh: goldMesh
      }

    }

    onMounted(async() => {
      openTimer() // 开启定时器提高速度
      liveTime() // 计时存活时间
			const scene = new THREE.Scene();
			var axisHelper = new THREE.AxisHelper(1000)
			scene.add(axisHelper);

      /**
			 * 光源设置
			 */
			//点光源
			const point = new THREE.PointLight(0xffffff);
      const point1 = new THREE.PointLight(0xffffff);
			point.position.set(400, 200, 300); //点光源位置
			point1.position.set(0, 0, 0); //点光源位置
			scene.add(point, point1); //点光源添加到场景中
			//环境光
			var ambient = new THREE.AmbientLight(0x444444);
			scene.add(ambient);
			// console.log(scene)
			// console.log(scene.children)
			/**
			 * 相机设置
			 */
			var width = window.innerWidth; //窗口宽度
			var height = window.innerHeight; //窗口高度
			var k = width / height; //窗口宽高比
			var s = 50; //三维场景显示范围控制系数，系数越大，显示的范围越大
			//创建相机对象
			var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 500);
			camera.position.set(100, 200, 400); //设置相机位置
			camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
			/**
			 * 创建渲染器对象
			 */
			var renderer = new THREE.WebGLRenderer();
			renderer.setSize(width, height);//设置渲染区域尺寸
			renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
			document.body.appendChild(renderer.domElement); //body元素中插入canvas对象

      // 添加鼠标事件
			new OrbitControls(camera,renderer.domElement)

      // 创建模型 并返回模型对象
      
      const {
        meshGround,
        meshGroundPrev,
        meshGroundPrev1,
        meshGroundNext,
        meshGroundNext1,
        meshBox,
        manMesh,
        goldMesh
      } = creatModal(scene)
      scene.add(meshGroundPrev1, meshGroundPrev, meshGround, meshGroundNext, meshGroundNext1, meshBox);
			//执行渲染操作   指定场景、相机作为参数
      const list = [meshGroundPrev1,meshGroundPrev,meshGround,meshGroundNext,meshGroundNext1]
      const boxList = [meshBox] // 显示在路面上的障碍物
      const goldList = [] // 显示在路面上的食物
      const boxFreeList = [] // 空闲的障碍物
      for (var i = 0; i < maxNumBox.value; i++) { // 生成障碍物空闲列表
        const cloneBox = meshBox.clone()
        cloneBox.position.x = 1000
        boxFreeList.push(cloneBox)
      }
      scene.add(...boxFreeList)
			const render = () => {
        if (gameOver.value) { return }
        meshBoxAnimate(boxList, boxFreeList) // 障碍物动画
        goldMeshAnimate(goldList, goldMesh, scene) // 生成食物(得分)动画
        meshGroundAnimate(list) // 地板动画
        meshManAnimate(manMesh.value) // 人物模型动画
        handleCheck(boxList, goldList) // 进行检测 保证游戏的正常
        // isGameOver(manMesh.value, boxList) // 判断游戏是否结束
        isEat(manMesh.value, goldList, scene) // 判断人物上是否吃到食物


				renderer.render(scene, camera);
				requestAnimationFrame(render)
			}
			render()
      // 添加空格按键监听
      document.onkeyup = (e) => {
        if (manMesh.value && e.keyCode === 32 && jumpNumed.value < jumpNum) {
          ++jumpNumed.value
          if (manMesh.value.position.y > 0) {
            jumpHeight.value = jumpHeight.value + manMesh.value.position.y
          }
          isRise.value = true
        }
      }
		})

    return {
      gameOver,
      gameTime,
      getGold
    }
	}
     

				
})
</script>

<style lang="less">

  body { 
    margin: 0; 
  }
		
  
  canvas { 
    width: 100%;
    height: 100% ;
  }

  .game-container{
    position: relative;

    .tips-box{
      position: fixed;
      right: 0;
      left: 0;
      z-index: -1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.6);
      opacity: 1;
      transition: all 1;

      &.show{
        z-index: 2;
        opacity: 1;
      }

      .content{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        height: 100px;
        font-size: 20px;
        font-weight: 700;
        color: red;
        background: #fff;
        border-radius: 20px;
      }
    }

    .time{
      position: fixed;
      top: 10%;
      right: 10%;
      font-size: 20px;
      font-weight: 600;
      color: #000;
    }

    .gold{
      position: fixed;
      top: 5%;
      right: 10%;
      font-size: 20px;
      font-weight: 600;
      color: #000;
    }
  }


</style>