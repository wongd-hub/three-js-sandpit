import { useRouter } from 'next/router';
import Link from 'next/link';


export default function UsefulLinks() {




    return (
        <div>
            <Link href="/">Back to Home</Link>

            <h2>Tutorials</h2>
            <ul>
                <li><a href={"https://www.digitalocean.com/community/tutorials/react-react-with-threejs"}>How To Use three.js in React with react-three-fiber</a></li>
                <li><a href={"https://tympanus.net/codrops/2020/12/17/recreating-a-dave-whyte-animation-in-react-three-fiber/"}>Breathing Dots</a></li>
            </ul>

            <h2>CodeSandbox Links</h2>
            <ul>
                <li><a href={"https://codesandbox.io/s/circling-birds-c671i?from-embed=&file=/src/App.js"}>Circling birds</a></li>
            </ul>


        </div>
    )




}