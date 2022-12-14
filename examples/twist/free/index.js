import * as THREE from 'three'
import { Mesh, PerspectiveCamera, Scene, WebGLRenderer } from 'three'

import * as TWEEN from '@tweenjs/tween.js'

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

  const twistAmount = {value: 0.0}
  const firstPos = boxGeo.attributes.position.clone()

  const twist = geometry => {
    const quaternion = new THREE.Quaternion()
    
    const posArray = firstPos.array
    const geoPosition = geometry.attributes.position
    for (let i = 0; i < firstPos.count*3; i=i+3) {
      const postionVector = new THREE.Vector3(posArray[i],posArray[i+1],posArray[i+2])

      const upVec = new THREE.Vector3(0, 1, 0)

      quaternion.setFromAxisAngle(
        upVec,
        (Math.PI / 180) * ((postionVector.y + 10) * twistAmount.value)
      )

      postionVector.applyQuaternion(quaternion)
      geoPosition.array[i]   = postionVector.x
      geoPosition.array[i+1] = postionVector.y
      geoPosition.array[i+2] = postionVector.z
    }
    geoPosition.needsUpdate = true
  }

  let start = 0.0
  let onDown = false
  window.addEventListener('pointerdown', e => {
    if( onDown ) return
    start = e.clientX
    onDown = true
  })
  window.addEventListener('pointermove', e => {
    if( !onDown ) return
    e.preventDefault()
    const delta = e.clientX - start
    start = e.clientX
    twistAmount.value += delta * .01
    twist(boxGeo)
  })
  window.addEventListener('pointerup', () => {
    new TWEEN.Tween(twistAmount)
      .to( { value: 0.0 }, 1000)
      .easing(TWEEN.Easing.Elastic.Out)
      .onUpdate(()=>{
        twist(boxGeo)
      })
      .start()
      .onComplete(() => {
        onDown = false
      })
  })

  const animate = delta => {
    requestAnimationFrame( animate )

    TWEEN.update(delta)

    renderer.render( scene, camera )
  }
  animate()

}
init()