import { prisma } from './../../../../generated/prisma-client'
import { generateSecret } from '../../../utils';

export default {
  Mutation:{
    requestSecret: async(_, args) => {
      const { email } = args;
      const loginSecret = generateSecret();
      
      try{
        await prisma.updateUser({data:{ loginSecret }, where:{ email }});
        console.log(loginSecret);
        console.log(email);
        return true;
      }catch(error){
        console.log(error);
        console.log(loginSecret);
        console.log(email);
        return false;
      }
    }
  }
}