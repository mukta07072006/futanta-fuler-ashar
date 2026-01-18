import { useState, useEffect, useRef, memo } from 'react';

const CountdownTimer = memo(({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  function calculateTimeLeft(target) {
    if (!target) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const now = Date.now();
    const difference = new Date(target).getTime() - now;
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    mountedRef.current = true;

    // Initial calculation
    setTimeLeft(calculateTimeLeft(targetDate));

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only set interval if we have a valid future date
    if (targetDate && new Date(targetDate).getTime() > Date.now()) {
      intervalRef.current = setInterval(() => {
        if (!mountedRef.current) return;
        
        setTimeLeft(prev => {
          const { days, hours, minutes, seconds } = prev;
          
          // Optimized: Only recalculate when seconds reach 0
          if (seconds > 0) {
            return { ...prev, seconds: seconds - 1 };
          } else if (minutes > 0) {
            return { days, hours, minutes: minutes - 1, seconds: 59 };
          } else if (hours > 0) {
            return { days, hours: hours - 1, minutes: 59, seconds: 59 };
          } else if (days > 0) {
            return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
          } else {
            clearInterval(intervalRef.current);
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
          }
        });
      }, 1000);
    }

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetDate]);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  // Don't render anything if no valid target date
  if (!targetDate || new Date(targetDate).getTime() <= Date.now()) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {[
        { label: 'দিন', value: timeLeft.days },
        { label: 'ঘন্টা', value: timeLeft.hours },
        { label: 'মিনিট', value: timeLeft.minutes },
        { label: 'সেকেন্ড', value: timeLeft.seconds }
      ].map(({ label, value }, index) => (
        <div key={label} className="flex items-center">
          <div className="text-center">
            <div className="text-xl md:text-3xl font-bold text-green-600">
              {formatNumber(value)}
            </div>
            <div className="text-[10px] md:text-xs text-slate-500">{label}</div>
          </div>
          {index < 3 && <div className="text-lg text-slate-300 px-1">:</div>}
        </div>
      ))}
    </div>
  );
});

CountdownTimer.displayName = 'CountdownTimer';
export default CountdownTimer;