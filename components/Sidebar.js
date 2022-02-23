import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const sidebarVariants = {
  open: { x: 0 },
  closed: { x: 500 },
};

export default function Sidebar(props) {
  return (
    <motion.div
      className="sidebar-container"
      variants={sidebarVariants}
      animate={props.activation ? "open" : "closed"}
    >
      <div className="sidebar-contents">
        <span onClick={props.exitButton}>✕</span>
        <span className="per-page-picker">
          <strong>Per page: </strong>
          {Array.apply(null, Array(4 + 1))
            .map(function (_, i) {
              return i;
            })
            .slice(1)
            .map((el, i) => (
              <span
                onClick={() => props.setNumPerPage(el)}
                className="per-page-picker-item"
                key={`${el}${i}`}
              >
                {el}
              </span>
            ))}
        </span>
        <div className="toc">
          <strong>Table of Contents</strong>
        </div>
      </div>
    </motion.div>
  );
}
