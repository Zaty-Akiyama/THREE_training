import * as THREE from "three"
import GUI from 'lil-gui'

const gui = new GUI()

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

  const light = new THREE.SpotLight( 0xf0f0f0 )
  light.position.set( -10, 30, 40 )
  light.castShadow = true
  
  scene.add(light)

  const lightHelper = new THREE.CameraHelper( light.shadow.camera )
  const lightGuiObj = { helper: false }
  gui.add( lightGuiObj, 'helper' )
    .name( 'Light Helper' )
    .onChange( enable => {
      if( enable )
      {
        scene.add( lightHelper )
      }else
      {
        scene.remove( lightHelper )
      }
    })

  const camera = new THREE.PerspectiveCamera( 45, width/height, 5, 1000 )
  camera.position.set(150,50,60)
  camera.lookAt( 0, 0, 0 )
  scene.add(camera)

  const boxGeo = new THREE.BoxGeometry(10,10,10)
  const boxMat = new THREE.MeshLambertMaterial()
  const box = new THREE.Mesh(boxGeo,boxMat)
  box.castShadow = true
  scene.add(box)

  const planeGeo = new THREE.PlaneGeometry( 1000, 1000, 50, 50)
  const planeMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
  })
  const plane = new THREE.Mesh(planeGeo,planeMat)
  plane.rotation.set(-Math.PI/2,0,0)
  plane.receiveShadow = true
  scene.add(plane)
  
  const animate = () => {
    requestAnimationFrame( animate )

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