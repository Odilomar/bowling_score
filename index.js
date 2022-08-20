const input = "165/251/X2/71XX1/7";

const DEFAULT_SCORE = "0";
const DEFAULT_PILLOW_AMOUNT = 10;
const DEFAULT_STRIKE_SCORE = 10;

const isSpare = (score) =>
  ((typeof score !== "string" && `${score}`) || score).includes("/");
const isStrike = (score) =>
  ((typeof score !== "string" && `${score}`) || score).includes("X");

const getPreviousScore = ({ scores, index }) => {
  const previousIndex = index - 1;
  const previous = scores[previousIndex] || DEFAULT_SCORE;

  return { previousIndex, previous };
};

const getNextScore = ({ scores, index }) => {
  const nextIndex = index + 1;
  const next = scores[nextIndex] || DEFAULT_SCORE;

  return { nextIndex, next };
};

const getNextNextScore = ({ scores, index }) => {
  const nextNextIndex = index + 1;
  const nextNext = scores[nextNextIndex] || DEFAULT_SCORE;

  return { nextNextIndex, nextNext };
};

const handleSpare = ({ score, scores, index, bonus = false }) => {
  if (isSpare(score)) {
    const { previous } = getPreviousScore({ scores, index });
    let { nextIndex, next } = getNextScore({ scores, index });

    if (isStrike(next)) {
      next = handleStrike({ score: next, scores, index: nextIndex });
    }

    if (!(nextIndex < scores.length - 1 && bonus)) {
      next = DEFAULT_SCORE;
    }

    score = DEFAULT_PILLOW_AMOUNT - +previous + +next;
  }

  return score;
};

const handleStrike = ({ score, scores, index, bonus = false }) => {
  if (isStrike(score)) {
    score = DEFAULT_STRIKE_SCORE;

    if (index < scores.length - 3 && bonus) {
      let { nextIndex, next } = getNextScore({ scores, index });
      let { nextNextIndex, nextNext } = getNextNextScore({
        scores,
        index: nextIndex,
      });

      const nextParams = { score: next, scores, index: nextIndex };
      const nextNextParams = { score: nextNext, scores, index: nextNextIndex };

      next =
        (isSpare(next) && handleSpare(nextParams)) ||
        (isStrike(next) && handleStrike(nextParams)) ||
        next;
      nextNext =
        (isSpare(nextNext) && handleSpare(nextNextParams)) ||
        (isStrike(nextNext) && handleStrike(nextNextParams)) ||
        nextNext;

      score += +next + +nextNext;
    }
  }

  return score;
};

const calculateScore = (str) => {
  let total = 0;
  const bonus = true;
  const scores = str.split("");

  for (let [index, score] of scores.entries()) {
    const params = {
      scores,
      index,
      bonus,
    };

    score = handleSpare({...params, score});
    score = handleStrike({...params, score});

    total += +score;
  }

  return total;
};

console.log(calculateScore(input));
