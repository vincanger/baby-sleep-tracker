import HttpError from '@wasp/core/HttpError.js'

export const startSleep = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // args.startTime is a string, e.g. '18:27'. convert it to a Date object
  let startTime = new Date();
  const [hours, minutes] = args.startTime.split(':');
  startTime.setHours(hours);
  startTime.setMinutes(minutes);
  startTime.setSeconds(0);
  startTime.setMilliseconds(0);
  // set the start time to const today
  startTime.setDate(today.getDate());
  const startTimeStr = startTime.toISOString();

  console.log('startTime', startTime)

  // args.endTime is a string, e.g. '06:27'. convert it to a Date object
  let endTime = new Date();
  const [endHours, endMinutes] = args.endTime.split(':');
  endTime.setHours(endHours);
  endTime.setMinutes(endMinutes);
  endTime.setSeconds(0);
  endTime.setMilliseconds(0);
  // set the end time to const tomorrow
  endTime.setDate(tomorrow.getDate());
  console.log('endTime', endTime)
  
  const endTimeStr = endTime.toISOString();
  console.log('endTimeStr', endTimeStr)

  // calculate total hours slept
  let totalSleepTime = (endTime - startTime) / 1000 / 60 / 60;
  totalSleepTime = totalSleepTime.toString();

  const sleepLog = await context.entities.SleepLog.create({

    data: {
      startTime: startTimeStr,
      endTime: endTimeStr,
      startDate: today,
      endDate: tomorrow,
      totalSleepTime,
      user: { connect: { id: context.user.id } }
    }
  });

  console.log('sleepLog', sleepLog)

  return sleepLog;
}

export const endSleep = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const { userId } = context.user;

  const latestSleepLog = await context.entities.SleepLog.findFirst({
    where: { userId },
    orderBy: { endTime: 'desc' }
  });

  if (!latestSleepLog) { throw new HttpError(404, 'No sleep logs found for user') };

  const updatedSleepLog = await context.entities.SleepLog.update({
    where: { id: latestSleepLog.id },
    data: { endTime: new Date() }
  });

  return updatedSleepLog;
}

export const startNap = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const newNapLog = await context.entities.NapLog.create({
    data: {
      startTime: new Date().toISOString(),
      user: { connect: { id: context.user.id } }
    }
  });

  return newNapLog;
}

export const endNap = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const { userId } = context.user;

  const latestNapLog = await context.entities.NapLog.findFirst({
    where: { userId },
    orderBy: { endTime: 'desc' }
  });

  if (!latestNapLog) { throw new HttpError(400, 'No nap log found for the user') };

  const updatedNapLog = await context.entities.NapLog.update({
    where: { id: latestNapLog.id },
    data: { endTime: new Date() }
  });

  return updatedNapLog;
}