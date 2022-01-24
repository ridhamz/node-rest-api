function createObject(x, y) {
  return {
    x,
    y,
    display() {
      console.log(`x => ${x}, y => ${y}`);
    },
  };
}

const obj1 = createObject(2, 8);
obj1.display(); // x => 2, y => 8

const obj2 = createObject(6, 1);
obj2.display(); // x => 6, y => 1
