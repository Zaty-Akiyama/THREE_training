import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

const gui = new GUI()
const guiConfig = {
  activeOrbit: false,
  resetWindow: () => {
    document.location.reload()
  }
}
gui.add( guiConfig, 'resetWindow' )
  .name('ページをリセット')

init()
function init () {

  const width = window.innerWidth
  const height = window.innerHeight

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  document.body.appendChild(renderer.domElement)
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( width, height )
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true

  const scene = new THREE.Scene()

  const redLight = new THREE.SpotLight( 0xf00000 )
  redLight.position.set( 0, 60, 0 )
  redLight.angle = Math.PI /7
  redLight.castShadow = true
  
  scene.add(redLight)

  const redLightHelper = new THREE.SpotLightHelper( redLight )
  scene.add( redLightHelper )

  const blueLight = redLight.clone()
  blueLight.color.set( 0x0000f0 )
  scene.add(blueLight)

  const blueLightHelper = new THREE.SpotLightHelper( blueLight )
  scene.add( blueLightHelper )

  const greenLight = redLight.clone()
  greenLight.color.set( 0x00f000 )
  scene.add(greenLight)

  const greenLightHelper = new THREE.SpotLightHelper( greenLight )
  scene.add( greenLightHelper )


  const lightGuiObj = { helper: true }
  gui.add( lightGuiObj, 'helper' )
    .name( 'Light Helper' )
    .onChange( enable => {
      if( enable )
      {
        scene.add( redLightHelper )
        scene.add( blueLightHelper )
        scene.add( greenLightHelper )
      }else
      {
        scene.remove( redLightHelper )
        scene.remove( blueLightHelper )
        scene.remove( greenLightHelper )
      }
    })

  const camera = new THREE.PerspectiveCamera( 45, width/height, 5, 1000 )
  camera.position.set(-130,80,100)
  camera.lookAt( 0, 0, 0 )
  scene.add(camera)

  const boxGeo = new THREE.BoxGeometry(10,10,10)
  const boxMat = new THREE.MeshStandardMaterial()
  const box = new THREE.Mesh(boxGeo,boxMat)
  box.castShadow = true
  box.receiveShadow = true
  scene.add(box)

  redLight.target = box
  blueLight.target = box
  greenLight.target = box

  const planeGeo = new THREE.PlaneGeometry( 1000, 1000, 50, 50)
  const planeMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
  })
  const plane = new THREE.Mesh(planeGeo,planeMat)
  plane.rotation.set(-Math.PI/2,0,0)
  plane.receiveShadow = true
  scene.add(plane)

  const controls = new OrbitControls( camera, renderer.domElement )
  controls.enableZoom = false
  controls.enablePan = false
  controls.enableRotate = false

  gui.add( guiConfig, 'activeOrbit' )
    .name('コントロールを有効')
    .onChange( value => {
      controls.enableZoom = value
      controls.enablePan = value
      controls.enableRotate = value
    })
  
  const lightsHelperUpdate = () => {
    redLightHelper.update()
    blueLightHelper.update()
    greenLightHelper.update()
  }
  const animate = (delta) => {
    requestAnimationFrame( animate )

    box.position.y = 4 * (Math.cos(delta * .002) + 1) + 10
    box.rotation.x += .01
    box.rotation.y += .008
    box.rotation.z -= .005

    redLight.position.x = 20 * Math.cos(delta * .001)
    redLight.position.z = 20 * Math.sin(delta * .001)

    blueLight.position.x = 20 * Math.cos(delta * .001 + Math.PI*2/3)
    blueLight.position.z = 20 * Math.sin(delta * .001 + Math.PI*2/3)
    
    greenLight.position.x = 20 * Math.cos(delta * .001 + Math.PI*4/3)
    greenLight.position.z = 20 * Math.sin(delta * .001 + Math.PI*4/3)

    lightsHelperUpdate()
    controls.update()
    renderer.render( scene, camera )
  }
  animate()
  
  const onWindowResize = () => {
    const resizeWidth = window.innerWidth
    const resizeHeight = window.innerHeight
    
    camera.aspect = resizeWidth/resizeHeight
    camera.updateProjectionMatrix()
    renderer.setSize(resizeWidth,resizeHeight)
  }
  window.addEventListener('resize',onWindowResize,false)
}