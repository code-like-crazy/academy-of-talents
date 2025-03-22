import { useGLTF } from "@react-three/drei"
import { ThreeElements } from "@react-three/fiber"

export const teachers = ["krins"]

export const Teacher = ({teacher, ...props}: {teacher: string} & ThreeElements['group']) => {
    const { scene } = useGLTF(`/models/Teacher_${teacher}.glb`)
    return <group {...props}>
        <primitive object={scene} />
    </group>
}

teachers.forEach((teacher) => {
    useGLTF.preload(`/models/Teacher_${teacher}.glb`)
})