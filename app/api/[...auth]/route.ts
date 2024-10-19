import Auth from '@/lib/core';
import { options } from '@/options';

const handler = Auth(options);

export { handler as GET, handler as POST };
