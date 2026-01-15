import { DeleteObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { generateID } from '../../utils/helpers';
import config from '../../config';
import path from 'node:path';
import * as fs from 'node:fs';
import { SettingService } from '../setting/setting.service';

export const s3UploadFiles = async (files: any, folder: string) => {
    if (files.length === 0) return Promise.resolve([]);
    const s3 = new S3();
    const params = files.map((file: any) => {
        return {
            ACL: 'public-read',
            Bucket: config.aws_bucket_name,
            Key: `${config.website_name}-storage/${folder}/${generateID('', 8)}-${file.name}`
                .split(' ')
                .join('-'),
            Body: file.data,
        };
    });

    return await Promise.all(
        params.map(async (param: any) => {
            await s3.send(new PutObjectCommand(param));
            return `https://${config.aws_bucket_name}.s3.${config.aws_region}.amazonaws.com/${param.Key}`;
        }),
    );
};
export const s3DeleteFiles = async (files: any) => {
    if (files.length === 0) return Promise.resolve();
    const s3 = new S3();
    const params: any = files.map((file: any) => {
        return {
            Bucket: config.aws_bucket_name,
            Key: file.replace(
                `https://${config.aws_bucket_name}.s3.${config.aws_region}.amazonaws.com/`,
                '',
            ),
        };
    });
    return await Promise.all(
        params.map(
            async (param: any) => await s3.send(new DeleteObjectCommand(param)),
        ),
    );
};
export const s3UploadFile = async (file: any, folder: string) => {
    if (!file) return Promise.resolve('');
    const s3 = new S3();
    const params: any = {
        ACL: 'public-read',
        Bucket: config.aws_bucket_name,
        Key: `${config.website_name}-storage/${folder}/${generateID('', 8)}-${file.name}`
            .split(' ')
            .join('-'),
        Body: file.data,
    };
    await s3.send(new PutObjectCommand(params));
    return Promise.resolve(
        `https://${config.aws_bucket_name}.s3.${config.aws_region}.amazonaws.com/${params.Key}`,
    );
};
export const localUploadFile = async (file: any, folder: string) => {
    if (!file) return Promise.resolve('');
    // eslint-disable-next-line no-undef
    const uploadDir = path.join(__dirname, '../../../../', 'public', folder);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const setting = await SettingService.findSettingBySelect({
        server_side_url: 1,
    });
    const filename =
        file.name
            .replace(path.extname(file.name), '')
            .toLowerCase()
            .split(' ')
            .join('-') +
        '-' +
        Date.now() +
        path.extname(file.name);
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.data);
    return Promise.resolve(
        setting.server_side_url +
            '/' +
            filePath.substring(filePath.indexOf('public')),
    );
};
export const localUploadFiles = async (files: any, folder: string) => {
    if (files.length === 0) return Promise.resolve([]);
    // eslint-disable-next-line no-undef
    const uploadDir = path.join(__dirname, '../../../../', 'public', folder);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const setting = await SettingService.findSettingBySelect({
        server_side_url: 1,
    });
    const params = files.map((file: any) => {
        const filename =
            file.name
                .replace(path.extname(file.name), '')
                .toLowerCase()
                .split(' ')
                .join('-') +
            '-' +
            Date.now() +
            path.extname(file.name);
        return {
            uploadDir: path.join(uploadDir, filename),
            body: file.data,
        };
    });
    return await Promise.all(
        params.map(async (param: any) => {
            fs.writeFileSync(param.uploadDir, param.body);
            return (
                setting.server_side_url +
                '/' +
                param.uploadDir.substring(param.uploadDir.indexOf('public'))
            );
        }),
    );
};
export const localDeleteFiles = async (files: any) => {
    if (files.length === 0) return Promise.resolve([]);
    // eslint-disable-next-line no-undef
    const removeDir = path.join(__dirname, '../../../../');
    files.map((file: any) => {
        const removeFile =
            removeDir + '/' + file.substring(file.indexOf('public'));
        if (fs.existsSync(removeFile)) {
            fs.unlinkSync(removeFile);
        }
    });
    return await Promise.all(files);
};
export const deleteFiles = async (files: any) => {
    const setting = await SettingService.findSettingBySelect({
        file_upload_type: 1,
    });
    if (setting.file_upload_type == 's3') {
        await s3DeleteFiles(files);
    } else if (setting.file_upload_type == 'local') {
        await localDeleteFiles(files);
    }
};
