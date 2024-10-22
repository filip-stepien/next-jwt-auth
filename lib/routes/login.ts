import { AuthRouteHandler } from '@/lib/types';
import { getAuthResponse } from '@/lib/utils/auth';

const loginRoute: AuthRouteHandler = async (req, opt) => {
    return getAuthResponse(req, opt, opt.login);
};

export default loginRoute;
