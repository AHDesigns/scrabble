import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
// import _ from "lodash";
//
const _ = 0;
const r = 1; // tripple word
const b = 2; // double word
const o = 3; // douuble letter
const t = 4; // tripple letter

const tileMapper = {
  0: " ",
  1: "tripple word",
  2: "double word",
  3: "double letter",
  4: "tripple letter",
};

const tileColors = {
  0: "#7fc7bb",
  1: "#e27d60",
  2: "#c38d9e",
  3: "#41b3a3",
  4: "#e8a87c",
};

const tileCount = {
  a: 9,
  b: 2,
  c: 2,
  d: 4,
  e: 12,
  f: 2,
  g: 3,
  h: 2,
  i: 9,
  j: 1,
  k: 1,
  l: 4,
  m: 2,
  n: 6,
  o: 8,
  p: 2,
  q: 1,
  r: 6,
  s: 4,
  t: 6,
  u: 4,
  v: 2,
  w: 2,
  x: 1,
  y: 2,
  z: 1,
};

const bag = shuffle(
  shuffle(
    Object.entries(tileCount).reduce((all, [tile, count]) => {
      const ls = new Array(count).fill(tile);
      return all.concat(ls);
    }, [])
  )
);

const tilePoints = {
  a: 1,
  b: 3,
  c: 3,
  d: 2,
  e: 1,
  f: 4,
  g: 2,
  h: 4,
  i: 1,
  j: 8,
  k: 5,
  l: 1,
  m: 3,
  n: 1,
  o: 1,
  p: 3,
  q: 10,
  r: 1,
  s: 1,
  t: 1,
  u: 1,
  v: 4,
  w: 4,
  x: 8,
  y: 4,
  z: 10,
};

const boardTL = [
  [r, _, _, b, _, _, _, r, _, _, _, b, _, _, r],
  [_, o, _, _, _, t, _, _, _, t, _, _, _, o, _],
  [_, _, o, _, _, _, b, _, b, _, _, _, o, _, _],
  [b, _, _, o, _, _, _, b, _, _, _, o, _, _, b],
  [_, _, _, _, o, _, _, _, _, _, o, _, _, _, _],
  [_, t, _, _, _, t, _, _, _, t, _, _, _, t, _],
  [_, _, b, _, _, _, b, _, b, _, _, _, b, _, _],
  [r, _, _, b, _, _, _, b, _, _, _, b, _, _, r],
  [_, _, b, _, _, _, b, _, b, _, _, _, b, _, _],
  [_, t, _, _, _, t, _, _, _, t, _, _, _, t, _],
  [_, _, _, _, o, _, _, _, _, _, o, _, _, _, _],
  [b, _, _, o, _, _, _, b, _, _, _, o, _, _, b],
  [_, _, o, _, _, _, b, _, b, _, _, _, o, _, _],
  [_, o, _, _, _, t, _, _, _, t, _, _, _, o, _],
  [r, _, _, b, _, _, _, r, _, _, _, b, _, _, r],
];

const debug = {
  backgroundColor: "#2e1114",
  color: "white",
};

function App() {
  // const board = _.zip(boardTL, boardTR);
  const board = boardTL;
  const [boardFilled, setFilled] = useState(empty(board));
  const [usedTiles, setUsedTiles] = useState([]);

  const [activePlayer, setActivePlayer] = useState("a");
  const [hide, toggleHide] = useState(false);

  const [playerATiles, setPlayerATiles] = useState([]);
  const [playerBTiles, setPlayerBTiles] = useState([]);

  const [tile, setTile] = useState();

  return (
    <div style={{ width: "100vw", height: "100vh", ...debug, display: "flex" }}>
      <div style={{ marginRight: "20px", flexBasis: "1000px" }}>
        {board.map((row, rowIdx) => (
          <Row
            key={rowIdx}
            row={row}
            rowIdx={rowIdx}
            filled={boardFilled[rowIdx]}
            setFilled={setFilled}
            currentTile={tile}
            setTile={setTile}
            setUsedTiles={setUsedTiles}
            usedTiles={usedTiles}
          />
        ))}
      </div>
      <div>
        <p>player {activePlayer}</p>
        <Player
          hidden={hide}
          tiles={activePlayer === "a" ? playerATiles : playerBTiles}
          tile={tile}
          setTile={setTile}
          usedTiles={usedTiles}
        />
        <button
          style={{ marginTop: "20px" }}
          onClick={() => {
            toggleHide(true);
            setTile(null);
            setUsedTiles([]);
            if (activePlayer === "a") {
              setPlayerATiles((ts) => ts.filter((t) => !usedTiles.includes(t)));
            } else {
              setPlayerBTiles((ts) => ts.filter((t) => !usedTiles.includes(t)));
            }
            setActivePlayer((p) => (p === "a" ? "b" : "a"));
          }}
        >
          finish turn
        </button>
        <button
          onClick={() => {
            toggleHide(!hide);
          }}
        >
          {hide ? "show" : "hide"}
        </button>
        <div>
          <p>
            bag {bag.length}{" "}
            {activePlayer === "a" ? playerATiles.length : playerBTiles.length}/7
          </p>
          <button
            onClick={() => {
              const t = bag.pop();
              if (activePlayer === "a") {
                setPlayerATiles((ts) => ts.concat(t));
              } else {
                setPlayerBTiles((ts) => ts.concat(t));
              }
            }}
          >
            grab tile
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

function empty(board) {
  return board.map((row) => row.map(() => false));
}

const Row = ({
  row,
  rowIdx,
  filled,
  setFilled,
  currentTile,
  setTile,
  setUsedTiles,
  usedTiles,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "space-between",
      alignItems: "stretch",
      alignContent: "stretch",
      width: "1000px",
      height: "65px",
    }}
  >
    {row.map((cell, columnIdx) => (
      <div
        key={columnIdx}
        style={{ flexGrow: 1, width: "100%", height: "100%" }}
      >
        <Cell
          setFilled={setFilled}
          row={rowIdx}
          column={columnIdx}
          tile={cell}
          fill={filled[columnIdx]}
          currentTile={currentTile}
          setTile={setTile}
          usedTiles={usedTiles}
          setUsedTiles={setUsedTiles}
        />
      </div>
    ))}
  </div>
);

const Cell = ({
  fill,
  tile,
  row,
  column,
  setFilled,
  currentTile,
  setTile,
  usedTiles,
  setUsedTiles,
}) => {
  if (fill) {
    return (
      <button
        style={{
          fontSize: "1.2em",
          width: "100%",
          height: "100%",
          textAlign: "center",
          border: "thin solid grey",
          background: tileColors[tile],
        }}
        type="button"
        onClick={() => {
          if (usedTiles.includes(fill)) {
            setFilled((oldBoard) => {
              const newBoard = [...oldBoard];
              newBoard[row][column] = 0;
              return newBoard;
            });
            setUsedTiles((old) => old.filter((t) => t !== fill));
          }
        }}
      >
        {fill} <span style={{ fontSize: "0.6em" }}>{tilePoints[fill]}</span>
      </button>
    );
  }
  return (
    <button
      style={{
        width: "100%",
        height: "100%",
        fontSize: "0.8em",
        background: tileColors[tile],
        border: "thin solid grey",
      }}
      type="button"
      onClick={() => {
        setTile(null);

        if (currentTile) {
          setFilled((oldBoard) => {
            const newBoard = [...oldBoard];
            newBoard[row][column] = currentTile;
            return newBoard;
          });
          setUsedTiles((t) => t.concat(currentTile));
        } else {
          alert("choose a tile");
        }
      }}
    >
      {tileMapper[tile]}
    </button>
  );
};

const Player = ({ tiles, tile: currentTile, setTile, hidden, usedTiles }) => {
  return (
    <div>
      {tiles.map((tile, idx) => (
        <button
          style={{
            backgroundColor:
              tile === currentTile
                ? tileColors[1]
                : usedTiles.includes(tile)
                ? tileColors[2]
                : tileColors[3],
            marginRight: "10px",
          }}
          key={idx}
          type="button"
          onClick={() => {
            setTile(tile);
          }}
        >
          <p style={{ fontSize: "1.8em" }}>
            {hidden ? (
              "*"
            ) : (
              <>
                {tile}:{" "}
                <span style={{ fontSize: "0.6em" }}>{tilePoints[tile]}</span>
              </>
            )}
          </p>
        </button>
      ))}
    </div>
  );
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
