import Timer from "../components/Timer";
import ProgressBar from "../components/ProgressBar";
import QuestionCard from "../components/QuestionCard";
import { useContext, useEffect } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import useTimer from "../hooks/useTimer";

export default function Quiz() {
  const { state, dispatch } = useContext(QuizContext);
  const { index, questions } = state;
  const navigate = useNavigate();
  const { time, reset } = useTimer(15);
  useEffect(() => {
    if (time === 0) {
      dispatch({ type: "ANSWER", payload: false });
      reset();
    }
  }, [time]);

  if (!questions || questions.length === 0) {
    return <h2 className='text-center mt-5'>Loading...</h2>;
  }

  if (index >= questions.length) {
    dispatch({ type: "FINISH" });
    navigate("/result");
    return null;
  }

  const current = questions[index];

  const handleSelect = (option) => {
    dispatch({ type: "ANSWER", payload: option === current.answer });
    reset();
  };

  return (
    <div className='container mt-4'>
      <Timer time={time} />
      <ProgressBar current={index} total={questions.length} />
      <QuestionCard
        question={current.question}
        options={current.options}
        onSelect={handleSelect}
      />
    </div>
  );
}
