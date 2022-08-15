import * as bcrypt from 'bcryptjs';

const generate = async (data: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hashSync(data, salt);
};

const compare = async (
  clientData: string,
  databaseData: string,
): Promise<boolean> => {
  return await bcrypt.compareSync(clientData, databaseData);
};

const hashed = {
  generate,
  compare,
};

export default hashed;
