import type { NextPage } from "next";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useMemo } from "react";
import { Stats } from "@react-three/drei";

// Import components
import Sidebar from "../components/Sidebar";
import { AnimatedTextGeoms, BasicExamples } from "../components/basicExamples";
import BreathingDots from "../components/BreathingDots";
import ZeusScene from "../components/Zeus";
import ShowcaseScene from "../components/Showcase";
import ParticleField from "../components/ParticleNet";
import VanillaTea from "../components/VanillaTea";
import CustomCursor from "../components/CustomCursor";
// import MirrorScene from '../components/MirrorScene'
import BasicPhysics from "../components/BasicPhysics";
// import ImportedModelPhysics from '../components/ImportedModelPhysics'
import RippleScene from "../components/Ripple";
import ProceduralMesh from "../components/ProceduralMesh";

const slideVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      transition: {
        delay: 0.3,
      },
    };
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      position: "fixed",
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    };
  },
};

const Home: NextPage = () => {
  const [[page, direction], setPage] = useState([1, 0]);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [sidebar, setSidebar] = useState(false);

  const galleryStyle = { height: "50vh", width: "45vw", minWidth: "528px" };

  const galleryItems = useMemo(() => {
    return [
      {
        title: "n teacups + camera/animation effects",
        component: <VanillaTea style={galleryStyle} />,
      },
      {
        title: "Controlling camera with mouse, using the Instances element",
        notes: (
          <p>
            <a
              href="https://www.ilyameerovich.com/simple-3d-text-meshes-in-three-js/"
              target="_blank"
              rel="noreferrer"
            >
              Simple 3D Text Meshes in Three.js with React-Three-Fiber
            </a>
          </p>
        ),
        component: <BasicExamples style={galleryStyle} />,
      },
      {
        title: "Text animation test",
        component: <AnimatedTextGeoms style={galleryStyle} />,
      },
      {
        title: "Breathing Dots",
        notes: (
          <p>
            <a
              href="https://tympanus.net/codrops/2020/12/17/recreating-a-dave-whyte-animation-in-react-three-fiber/"
              target="_blank"
              rel="noreferrer"
            >
              Recreating a Dave Whyte Animation in React-Three-Fiber
            </a>
          </p>
        ),
        component: <BreathingDots style={galleryStyle} />,
      },
      {
        title: "More detailed imported model; mouse repel effect, glitch",
        notes: (
          <p>
            <a
              href="https://codesandbox.io/s/transparent-aesop-bottles-kv7tv"
              target="_blank"
              rel="noreferrer"
            >
              Transparent aesop bottles
            </a>
          </p>
        ),
        component: <ZeusScene style={galleryStyle} />,
      },
      {
        title: "",
        component: <ShowcaseScene style={galleryStyle} />,
      },
      {
        title: "Particle field",
        notes: (
          <p>
            <a
              href="https://codesandbox.io/s/lt473?file=/src/App.js"
              target="_blank"
              rel="noreferrer"
            >
              Particle field
            </a>
          </p>
        ),
        component: <ParticleField style={galleryStyle} />,
      },
      {
        title: "Basic physics demo",
        notes: (
          <p>
            <a
              href="https://github.com/pmndrs/use-cannon/blob/5ff2baacd7caff2079b21b42ea9ca7798070a5d9/examples/src/demos/demo-CubeHeap.tsx"
              target="_blank"
              rel="noreferrer"
            >
              Cube heap
            </a>
          </p>
        ),
        component: <BasicPhysics style={galleryStyle} />,
      },
      {
        title: "Particle ripple",
        notes: (
          <p>
            <a
              href="https://www.youtube.com/watch?v=wRmeFtRkF-8"
              target="_blank"
              rel="noreferrer"
            >
              Create a 3D Ripple Animation with React and Three.js using
              react-three-fiber
            </a>
          </p>
        ),
        component: <RippleScene which="ripple" style={galleryStyle} />,
      },
      {
        title: "Procedural mesh",
        notes: (
          <p>
            <a
              href="https://www.youtube.com/watch?v=2kTQZVzkXgI"
              target="_blank"
              rel="noreferrer"
            >
              Procedural Mesh Animation with Three.js and React using
              react-three-fiber
            </a>
          </p>
        ),
        component: <ProceduralMesh style={galleryStyle} />,
      },
      {
        title: "Procedural particles",
        component: <RippleScene which="particle" style={galleryStyle} />,
      },
    ];
  }, []);

  const numPages = useMemo(
    () => Math.ceil(galleryItems.length / itemsPerPage),
    [galleryItems, itemsPerPage]
  );

  return (
    <div className="page">
      <Head>
        <title>3js/r3f</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CustomCursor optionsButton={() => setSidebar(!sidebar)} />
      <Sidebar
        activation={sidebar}
        listOfExamples={galleryItems}
        exitButton={() => setSidebar(!sidebar)}
        setNumPerPage={setItemsPerPage}
        numPerPage={itemsPerPage}
        pageSetter={setPage}
      />

      <div className="page-container">
        <div className="examples-container">
          <AnimatePresence initial={false} custom={direction}>
            {galleryItems
              .slice(itemsPerPage * (page - 1), itemsPerPage * page)
              .map((el, i) => {
                return (
                  <motion.div
                    className="gallery-item"
                    key={`${el.title}${i}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    // transition={{
                    //   x: { type: "spring", stiffness: 300, damping: 30 },
                    //   opacity: { duration: 0.3 },
                    // }}
                  >
                    {el.title === "" ? <></> : <h2>{el.title}</h2>}
                    {el.notes ? el.notes : <></>}
                    {el.component}
                  </motion.div>
                );
              })}
          </AnimatePresence>
          <Stats className="stats-panel" />
        </div>
        <div className="page-numbers">
          <span
            onClick={page === 1 ? () => null : () => setPage([page - 1, -1])}
          >
            ←
          </span>
          {Array.apply(null, Array(numPages + 1))
            .map(function (_, i) {
              return i;
            })
            .slice(1)
            .map((el, i) => (
              <span
                key={i}
                onClick={() => {
                  el < page ? setPage([el, -1]) : setPage([el, 1]);
                }}
              >
                {el === page ? <strong>{el}</strong> : el}
              </span>
            ))}
          <span
            onClick={
              page === numPages ? () => null : () => setPage([page + 1, 1])
            }
          >
            →
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
