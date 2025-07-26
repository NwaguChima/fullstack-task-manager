import mongoose from 'mongoose';

const mongoDBConnect = async () => {
  try {
    const DBString: string | undefined = process.env?.['MONGO_URL']?.replace(
      '<PASSWORD>',
      process.env?.['MONGO_PASSWORD']!
    ) as string;

    await mongoose.connect(DBString);
    console.log('Database Connection successful...');
  } catch (error) {
    console.log(error);
  }
};

export default mongoDBConnect;
