// Adapted from this tutorial https://tympanus.net/codrops/2019/01/31/custom-cursor-effects/
// Todo - Figure out how to do this without having navlinks in the same component.

import { useEffect, useRef, useState } from "react";
import paper from "paper";
import SimplexNoise from "simplex-noise";

export default function CustomCursorAndNav(props) {
  const [vsize, setVSize] = useState([0, 0]);

  // Function for linear interpolation of values
  const lerp = (a, b, n) => {
    return (1 - n) * a + n * b;
  };

  // Function to map a value from one range to another range
  const map = (value, in_min, in_max, out_min, out_max) => {
    return (
      ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
  };

  // Handle white dot
  //  Set the starting position of the cursor outside of the screen
  let clientX = -100;
  let clientY = -100;
  const innerCursor = useRef();

  // Handle red circle
  let lastX = 0;
  let lastY = 0;
  let isStuck = false;
  const strokeColor = "rgba(255, 0, 0, 0.5)";
  const strokeWidth = 1;
  const segments = 8;
  const radius = 15;
  const shapeBounds = {
    width: 75,
    height: 75,
  };
  let group, stuckX, stuckY;

  // Setup canvas
  const canvas = useRef();

  // we'll need these later for the noisy circle
  const noiseScale = 150; // speed
  const noiseRange = 4; // range of distortion
  let isNoisy = false; // state

  // Add on-hover effects for custom cursor on links
  const handleMouseEnter = (e) => {
    if (typeof e.currentTarget !== "null") {
      const navItem = e.currentTarget;
      const navItemBox = navItem.getBoundingClientRect(); // && 'novalue';
      //if (navItemBox !== 'novalue') {
      stuckX = Math.round(navItemBox.left + navItemBox.width / 2);
      stuckY = Math.round(navItemBox.top + navItemBox.height / 2);
      isStuck = true;
      //}
    }
  };

  // Reset isStuck on mouseLeave
  const handleMouseLeave = () => {
    isStuck = false;
  };

  // Listen for window resize and re-render if it does to reset the red circle's position
  useEffect(() => {
    window.addEventListener("resize", () =>
      setVSize([window.innerWidth, window.innerHeight])
    );
    return () =>
      window.removeEventListener("resize", () =>
        setVSize([window.innerWidth, window.innerHeight])
      );
  }, []);

  useEffect(() => {
    paper.setup(canvas.current);

    // Set up polygon
    const polygon = new paper.Path.RegularPolygon(
      new paper.Point(0, 0),
      segments,
      radius
    );
    polygon.strokeColor = strokeColor;
    polygon.strokeWidth = strokeWidth;
    polygon.smooth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    group = new paper.Group([polygon]);
    group.applyMatrix = false;

    const noiseObjects = polygon.segments.map(() => new SimplexNoise());
    let bigCoordinates = [];

    // Add listener to track the current mouse position and move the white dot
    document.addEventListener("mousemove", (event) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clientX = event.clientX;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clientY = event.clientY;

      requestAnimationFrame(() => {
        innerCursor.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
      });
    });

    // Handle movement of red circle
    paper.view.onFrame = (event) => {
      // Using linear interpolation, the circle will move 0.2 (20%)
      // of the distance between its current position and the mouse
      // coordinates per Frame
      if (!isStuck) {
        // Move the circle around normally
        // eslint-disable-next-line react-hooks/exhaustive-deps
        lastX = lerp(lastX, clientX, 0.2);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        lastY = lerp(lastY, clientY, 0.2);
        group.position = new paper.Point(lastX, lastY);
      } else if (isStuck) {
        // Fixed position on a nav item
        lastX = lerp(lastX, stuckX, 0.2);
        lastY = lerp(lastY, stuckY, 0.2);
        group.position = new paper.Point(lastX, lastY);
      }

      if (isStuck && polygon.bounds.width < shapeBounds.width) {
        // scale up the shape
        polygon.scale(1.08);
      } else if (!isStuck && polygon.bounds.width > 30) {
        // remove noise
        if (isNoisy) {
          polygon.segments.forEach((segment, i) => {
            segment.point.set(bigCoordinates[i][0], bigCoordinates[i][1]);
          });
          isNoisy = false;
          bigCoordinates = [];
        }
        // Scale down the shape
        const scaleDown = 0.92;
        polygon.scale(scaleDown);
      }

      // while stuck and big, apply simplex noise
      if (isStuck && polygon.bounds.width >= shapeBounds.width) {
        isNoisy = true;
        // first get coordinates of large circle
        if (bigCoordinates.length === 0) {
          polygon.segments.forEach((segment, i) => {
            bigCoordinates[i] = [segment.point.x, segment.point.y];
          });
        }

        // loop over all points of the polygon
        polygon.segments.forEach((segment, i) => {
          // get new noise value
          // we divide event.count by noiseScale to get a very smooth value
          const noiseX = noiseObjects[i].noise2D(event.count / noiseScale, 0);
          const noiseY = noiseObjects[i].noise2D(event.count / noiseScale, 1);

          // map the noise value to our defined range
          const distortionX = map(noiseX, -1, 1, -noiseRange, noiseRange);
          const distortionY = map(noiseY, -1, 1, -noiseRange, noiseRange);

          // apply distortion to coordinates
          const newX = bigCoordinates[i][0] + distortionX;
          const newY = bigCoordinates[i][1] + distortionY;

          // set new (noisy) coodrindate of point
          segment.point.set(newX, newY);
        });
      }
      polygon.smooth();
    };
  }, [vsize]);

  return (
    <>
      <div ref={innerCursor} className="cursor cursor--small"></div>
      <canvas ref={canvas} className="cursor cursor--canvas"></canvas>

      <div className="title-bar">
        <h1>React Three Fiber/Drei examples in a Next.js project</h1>
        <nav className="nav">
          <a
            href="#"
            className="link"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              props.optionsButton();
              handleMouseLeave();
            }}
          >
            <svg
              className="settings-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
            >
              <g className="settings-icon__group settings-icon__group--1">
                <line
                  className="settings-icon__line"
                  x1="79.69"
                  y1="16.2"
                  x2="79.69"
                  y2="83.8"
                />
                <rect
                  className="settings-icon__rect"
                  x="73.59"
                  y="31.88"
                  width="12.19"
                  height="12.19"
                />
              </g>
              <g className="settings-icon__group settings-icon__group--2">
                <line
                  className="settings-icon__line"
                  x1="50.41"
                  y1="16.2"
                  x2="50.41"
                  y2="83.8"
                />
                <rect
                  className="settings-icon__rect"
                  x="44.31"
                  y="54.33"
                  width="12.19"
                  height="12.19"
                />
              </g>
              <g className="settings-icon__group settings-icon__group--3">
                <line
                  className="settings-icon__line"
                  x1="20.31"
                  y1="16.2"
                  x2="20.31"
                  y2="83.8"
                />
                <rect
                  className="settings-icon__rect"
                  x="14.22"
                  y="26.97"
                  width="12.19"
                  height="12.19"
                />
              </g>
            </svg>
          </a>
        </nav>
      </div>
    </>
  );
}
