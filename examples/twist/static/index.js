import * as THREE from 'three'
import { Mesh, PerspectiveCamera, Scene, WebGLRenderer } from 'three'

const init = () => {

  const width = window.innerWidth
  const height = window.innerHeight

  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true
  })
  document.body.appendChild(renderer.domElement)
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( width, height )

  const scene = new Scene()

  const camera = new PerspectiveCamera( 45, width/height, .01, 10000 )
  camera.position.set( 20, 30, 50 )
  camera.lookAt(0,0,0)
  scene.add( camera )
  
  const length = 20
  const segment = 50
  const boxGeo = new THREE.BoxGeometry(length,length,length, segment, segment, segment)
  const boxMat = new THREE.MeshNormalMaterial()
  const box = new Mesh(boxGeo,boxMat)
  scene.add(box)

  const animate = delta => {
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
  }
  animate()

}
init()
