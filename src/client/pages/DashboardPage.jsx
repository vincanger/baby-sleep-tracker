import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import startSleep from '@wasp/actions/startSleep';
import startNap from '@wasp/actions/startNap';
import endNap from '@wasp/actions/endNap';
import getSleepLogs from '@wasp/queries/getSleepLogs';
import getNapLogs from '@wasp/queries/getNapLogs';

export function DashboardPage() {
  const [nightSleepStart, setNightSleepStart] = useState('');
  const [nightSleepEnd, setNightSleepEnd] = useState('');
  const [napStart, setNapStart] = useState('');
  const [napEnd, setNapEnd] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logs, setLogs] = useState([])

  const { data: sleepLogs, isLoading: sleepLogsLoading } = useQuery(getSleepLogs);
  const { data: napLogs, isLoading: napLogsLoading } = useQuery(getNapLogs);
  const setSleepAction = useAction(startSleep);
  const startNapAction = useAction(startNap);
  const endNapAction = useAction(endNap);

  const handleSubmitNightSleep = () => {
    setSleepAction({ startTime: nightSleepStart, endTime: nightSleepEnd });
    setNightSleepStart('');
    setNightSleepEnd('');
  };

  const handleSubmitNap = () => {
    startNapAction({ startTime: napStart });
    endNapAction({ endTime: napEnd });
    setNapStart('');
    setNapEnd('');
  };

  useEffect(() => {
    if (sleepLogs) {
      const logs = sleepLogs.map((log) => {
        log.startTime = new Date(log.startTime).toLocaleTimeString();

        log.startTime = log.startTime.replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
        log.endTime = new Date(log.endTime).toLocaleTimeString();
        // convert to a.m. or p.m. format
        log.endTime = log.endTime.replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
        // covert start time to dd/mm and remove yyyy format
        console.log(log.startDate);
        // get Wed Jan 17 from log.startDate
        log.startDate = log.startDate.toDateString().slice(0, 10);
        return log;
      });
      setLogs(logs);
    }
  }
  , [sleepLogs]);

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <h2 className='text-xl font-bold mb-2'>Night Sleep</h2>
        <span>
          start sleep: {nightSleepStart} | end sleep: {nightSleepEnd}{' '}
        </span>
        <div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
          <span className='mx-2'>to</span>
          <input
            type='time'
            className='border rounded py-2 px-3'
            value={nightSleepEnd}
            onChange={(e) => setNightSleepEnd(e.target.value)}
          />
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3'
            onClick={handleSubmitNightSleep}
          >
            Log Sleep
          </button>
        </div>
      </div>
      <div>
        <h2 className='text-xl font-bold mb-2'>Nap</h2>
        <div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
          <span className='mx-2'>to</span>
          <input
            type='time'
            className='border rounded py-2 px-3'
            value={napEnd}
            onChange={(e) => setNapEnd(e.target.value)}
          />
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3'
            onClick={handleSubmitNap}
          >
            Log Nap
          </button>
        </div>
      </div>
      {sleepLogsLoading && <p>Loading sleep logs...</p>}
      {!sleepLogsLoading && logs.length > 0 && (
        <div>
          <h2 className='text-xl font-bold mt-4'>Sleep Logs</h2>
          <ul>
            {logs.map((log) => (
              <li key={log.id}>
                {' '}
                {log.startDate} : {log.startTime} - {log.endTime} ={' '}
                <span style={{ fontWeight: 'bold' }}> {log.totalSleepTime} hrs </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {napLogsLoading && <p>Loading nap logs...</p>}
      {!napLogsLoading && napLogs && (
        <div>
          <h2 className='text-xl font-bold mt-4'>Nap Logs</h2>
          <ul>
            {napLogs.map((log) => (
              <li key={log.id}>
                {log.startTime} - {log.endTime}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
