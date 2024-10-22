import { AuthRouteHandler } from '@/lib/types';
import { getAuthResponse } from '@/lib/utils/auth';

const registerRoute: AuthRouteHandler = async (req, opt) => {
    return getAuthResponse(req, opt, opt.register);
};

export default registerRoute;
