const table: any = [
   { circumference: 47, diameter: 14.96, hoop: 7 },
   { circumference: 48, diameter: 15.28, hoop: 8 },
   { circumference: 49, diameter: 15.6, hoop: 9 },
   { circumference: 50, diameter: 15.92, hoop: 10 },
   { circumference: 51, diameter: 16.23, hoop: 11 },
   { circumference: 52, diameter: 16.55, hoop: 12 },
   { circumference: 53, diameter: 16.87, hoop: 13 },
   { circumference: 54, diameter: 17.19, hoop: 14 },
   { circumference: 55, diameter: 17.51, hoop: 15 },
   { circumference: 56, diameter: 17.83, hoop: 16 },
   { circumference: 57, diameter: 18.14, hoop: 17 },
   { circumference: 58, diameter: 18.46, hoop: 18 },
   { circumference: 59, diameter: 18.76, hoop: 19 },
   { circumference: 60, diameter: 19.1, hoop: 20 },
   { circumference: 61, diameter: 19.42, hoop: 21 },
   { circumference: 62, diameter: 19.74, hoop: 22 },
   { circumference: 63, diameter: 20.05, hoop: 23 },
   { circumference: 64, diameter: 20.37, hoop: 24 },
   { circumference: 65, diameter: 20.69, hoop: 25 },
   { circumference: 66, diameter: 21.01, hoop: 26 },
   { circumference: 67, diameter: 21.33, hoop: 27 },
   { circumference: 68, diameter: 21.65, hoop: 28 },
   { circumference: 69, diameter: 21.96, hoop: 29 },
   { circumference: 70, diameter: 22.28, hoop: 30 },
   { circumference: 71, diameter: 22.6, hoop: 31 },
   { circumference: 72, diameter: 22.92, hoop: 32 },
   { circumference: 73, diameter: 23.24, hoop: 33 },
   { circumference: 74, diameter: 23.55, hoop: 34 },
   { circumference: 75, diameter: 23.87, hoop: 35 },
];

export function getHoopByDiameter(value: any) {
   return _getHoop(value, "diameter");
}

function _getHoop(value: any, mode: any) {
   for (let index = 0; index < table.length; index++) {
      if (value <= table[index][mode]) {
         return table[index].hoop;
      }
   }
   return null;
}
