import { AxiosFactory } from './axios.factory';

describe('AxiosFactory', () => {

    let axiosFactory: AxiosFactory;

    it('should delete the content-length on requests', async () => {
        const context = { headers: { 'Content-Length': 200, 'content-length': 100, 'securityToken': 'Test' } };
        axiosFactory = new AxiosFactory(context);

        const requestOptions = await axiosFactory.createHttpOptions();

        expect(requestOptions.headers.hasOwnProperty('Content-Length')).toEqual(false);
        expect(requestOptions.headers.hasOwnProperty('content-length')).toEqual(false);
        expect(requestOptions.headers.hasOwnProperty('securityToken')).toEqual(true);

    });

});
