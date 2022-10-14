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
  const boxGeo = new THREE.BoxGeometry(length,length,length, segment,segment,segment)
  const boxMat = new THREE.MeshNormalMaterial()
  const box = new Mesh(boxGeo,boxMat)
  scene.add(box)

  /** 追記 */
  const firstPos = boxGeo.attributes.position.clone()

  const twist = geometry => {
    const quaternion = new THREE.Quaternion()
    
    const firstPosArray = firstPos.array
    const geoPosition = geometry.attributes.position
    for (let i = 0; i < firstPosArray.length; i=i+3) {
      const postionVector = new THREE.Vector3(firstPosArray[i],firstPosArray[i+1],firstPosArray[i+2])

      const upVec = new THREE.Vector3(0, 1, 0)
  
      quaternion.setFromAxisAngle(
        upVec, 
        (Math.PI / 180) * (postionVector.y + 10) * 3
      )
  
      postionVector.applyQuaternion(quaternion)
      geoPosition.array[i] = postionVector.x
      geoPosition.array[i+1] = postionVector.y
      geoPosition.array[i+2] = postionVector.z
    }
    geoPosition.needsUpdate = true
  }
  twist(boxGeo)

  const animate = delta => {
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
  }
  animate()

}
init()