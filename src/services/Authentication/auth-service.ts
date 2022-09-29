import JWT from '../../utils/JWT';

async function auth(obj: any): Promise<string> {

    return JWT.signAccess({
        ...obj
    })
}

export default {auth} as const;