export default function QuestionCard({ question, options, onSelect }) {
  return (
    <div className='card shadow p-4'>
      <h4 className='fw-semibold'>{question}</h4>

      <div className='mt-3'>
        {options.map((opt, i) => (
          <button
            key={i}
            className='btn btn-outline-primary w-100 mt-2'
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}