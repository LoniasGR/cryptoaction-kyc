import { API_PATH } from '@/config/vars';

export function generateFileUrl(fileHash: string): URL {
    return new URL(`${API_PATH}/ipfs/${fileHash}`);
}