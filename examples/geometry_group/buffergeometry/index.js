import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
const gui = new GUI()
const verticesConfig = {
  x: 1.0, y: 1.0, z: 1.0
}

const init = () => {

  const width = window.innerWidth
  const height = window.innerHeight

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  document.body.appendChild(renderer.domElement)
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( width, height )
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera( 45, width/height, 5, 1000 )
  camera.position.set( 0,-1,10 )
  camera.lookAt( 0, 0, 0 )
  scene.add(camera)

  let vertices = new Float32Array([
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,

     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0, -1.0,  1.0
  ])
  gui.add( verticesConfig, 'x', -5.0, 5.0, .1 )
     .onChange( value => {
      vertices = new Float32Array([
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         verticesConfig.x,  verticesConfig.y,  verticesConfig.z,
    
         verticesConfig.x,  verticesConfig.y,  verticesConfig.z,
        -1.0,  1.0,  1.0,
        -1.0, -1.0,  1.0
      ])
      geo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
     })
    gui.add( verticesConfig, 'y', -5.0, 5.0, .1 )
    .onChange( value => {
    vertices = new Float32Array([
      -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        verticesConfig.x,  verticesConfig.y,  verticesConfig.z,
  
        verticesConfig.x,  verticesConfig.y,  verticesConfig.z,
        -1.0,  1.0,  1.0,
      -1.0, -1.0,  1.0
    ])
    geo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
    })
    gui.add( verticesConfig, 'z', -5.0, 5.0, .1 )
    .onChange( value => {
    vertices = new Float32Array([
      -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        verticesConfig.x,  verticesConfig.y,  verticesConfig.z,
  
        verticesConfig.x,  verticesConfig.y,  verticesConfig.z,
        -1.0,  1.0,  1.0,
      -1.0, -1.0,  1.0
    ])
    geo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
    })


  const geo = new THREE.BufferGeometry()
  geo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )

  const mat = new THREE.MeshNormalMaterial({wireframe: true})
  const meshBox = new THREE.Mesh(geo,mat)
  scene.add(meshBox)

  const controls = new OrbitControls( camera, renderer.domElement )

  const animate = (delta) => {
    requestAnimationFrame( animate )

    meshBox.rotation.x += .001
    meshBox.rotation.y += .001
    meshBox.rotation.z += .001

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
init()
