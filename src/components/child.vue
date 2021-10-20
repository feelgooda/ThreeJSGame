<template>
  <div class="box">
    
  </div>
</template>

<script>
import { defineComponent, reactive, toRaw, onMounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three';
import bgPic from '../assets/disturb.jpg'

export default defineComponent({
  setup() {
    onMounted(async() => {
			var scene = new THREE.Scene();
			var axisHelper = new THREE.AxisHelper(500)
			scene.add(axisHelper);
			/**
			 * 创建网格模型
			 */
			var geometry = new THREE.ConeBufferGeometry( 150, 180, 32 ); //创建一个球体几何对象 
			var material = new THREE.MeshLambertMaterial({
				color: 0x0000ff,
				opacity:0.5,
    		transparent:true
			}); //材质对象Material
			var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
			var geometry1 = new THREE.BoxGeometry(120, 120, 120); //创建一个立方体几何对象Geometry
			var material1 = new THREE.MeshNormalMaterial({
				wireframe: true
			}); //材质对象Material
			var mesh1 = new THREE.Mesh(geometry1, material1); //网格模型对象Mesh
			var box=new THREE.SphereGeometry(30,40,10)
			var material2 = new THREE.MeshLambertMaterial({
				color: 0xffffff,
				wireframe: true,
				specular:0x00FF00,
    		shininess:12
			});
			var axis = new THREE.Vector3(0,0,1)
			var angle = 0
			var mesh2 = new THREE.Mesh(box, material2); //网格模型对象Mesh
			mesh2.position.set(0,0,0)

			var angle1 = 0
			var texture = new THREE.TextureLoader();
			// 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
			const img = texture.load(bgPic)
			var geometry3 = new THREE.SphereGeometry(50,40,10)
			var material3 = new THREE.MeshLambertMaterial({
				map: img,
			}); 
			var mesh3 = new THREE.Mesh(geometry3, material3); //网格模型对象Mesh
			mesh3.position.set(0,0,0)


			scene.add(mesh); //网格模型添加到场景中
			scene.add(mesh1); //网格模型添加到场景中
			scene.add(mesh2); //网格模型添加到场景中
			scene.add(mesh3); //网格模型添加到场景中
			/**
			 * 光源设置
			 */
			//点光源
			var point = new THREE.PointLight(0xffffff);
			point.position.set(400, 200, 300); //点光源位置
			scene.add(point); //点光源添加到场景中
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
			var s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
			//创建相机对象
			var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
			camera.position.set(200, 300, 700); //设置相机位置
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

			//执行渲染操作   指定场景、相机作为参数

			const render = () => {
				renderer.render(scene, camera);
				mesh1.rotateY(0.01)
				mesh.rotateY(0.01)
				mesh2.rotateOnAxis(axis,Math.PI/8)
				mesh3.rotateOnAxis(axis,Math.PI/64)
				angle += 0.005;
				angle1 += 0.0025;
				// 圆周运动网格模型x坐标计算  绕转半径400
				var x = 150 * Math.sin(angle)
				var x1 = 200 * Math.sin(angle1)
				// 圆周运动网格模型y坐标计算  绕转半径400
				var z = 150 * Math.cos(angle)
				var z1 = 200 * Math.cos(angle1)
				// 每次执行render函数，更新需要做圆周运动网格模型Mesh的位置属性
				mesh2.position.set(x, 0, z);
				mesh3.position.set(x1, 0, z1);
				requestAnimationFrame(render)
			}
			render()
		})
	}
     

				
})
</script>

<style>

  body { 
    margin: 0; 
  }
		
  
  canvas { 
    width: 100%;
    height: 100% ;
  }
</style>