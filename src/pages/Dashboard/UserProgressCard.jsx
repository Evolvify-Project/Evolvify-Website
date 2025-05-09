const UserProgressCard = ({
  label,
  subtitle,
  subtitleColor,
  percentage,
  color,
}) => {
  return (
    <div className="bg-slate-100 p-4 rounded-lg text-center shadow-lg flex-1 min-w-[200px] h-48 flex items-center justify-center">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {subtitle && <p className={`text-sm ${subtitleColor}`}>{subtitle}</p>}
        <div className="relative h-24 w-24 mx-auto mt-2">
          <svg className="absolute inset-0" viewBox="0 0 36 36">
            <defs>
              <linearGradient
                id="circleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#1E3A5F" />
                <stop offset="100%" stopColor="#67B4FF" />
              </linearGradient>
            </defs>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#circleGradient)"
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-green-600">
            {percentage}%
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserProgressCard;
