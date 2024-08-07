export function interp1d(x, y) {
  return function (xp) {
    if (xp <= x[0]) return y[0];
    if (xp >= x[x.length - 1]) return y[y.length - 1];
    let i = 1;
    while (xp > x[i]) i++;
    let xL = x[i - 1],
      yL = y[i - 1],
      xR = x[i],
      yR = y[i];
    return yL + ((xp - xL) / (xR - xL)) * (yR - yL);
  };
}
