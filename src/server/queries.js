import HttpError from '@wasp/core/HttpError.js'

export const getSleepLogs = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  return context.entities.SleepLog.findMany({
    where: {
      userId: context.user.id
    }
  });
}

export const getNapLogs = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  return context.entities.NapLog.findMany({
    where: {
      userId: context.user.id
    }
  });
}
