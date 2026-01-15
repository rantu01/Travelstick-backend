import User from '../modules/user/user.model';
import Setting from '../modules/setting/setting.model';
import Language from '../modules/setting-language/setting-language.model';
import Page from '../modules/setting-page/setting-page.model';
import { ServiceService } from '../modules/service/service.service';
import { pages, services, sections } from './constants';
import { UserService } from '../modules/user/user.service';
import { SettingService } from '../modules/setting/setting.service';
import { SettingLanguageService } from '../modules/setting-language/setting-language.service';
import { SettingPageService } from '../modules/setting-page/setting-page.service';
import { SettingSectionService } from '../modules/setting-section/setting-section.service';
import config from '../config';
export const seedAdmin = async (
    adminInfo: {
        name: string;
        email: string;
        phone: string;
        password: string;
    },
    payload: {
        WEBSITE_NAME: string,
        CLIENT_SIDE_URL: string,
        SERVER_SIDE_URL: string,
        FILE_UPLOAD_TYPE: string,
    },
) => {
    const { name, email, phone, password } = adminInfo;
    const { WEBSITE_NAME, CLIENT_SIDE_URL, SERVER_SIDE_URL ,FILE_UPLOAD_TYPE} = payload;
    const user = await UserService.findUserByQuery({ role: 'admin' }, false);
    const setting = await SettingService.findSettingBySelect({}, false);
    const language = await SettingLanguageService.findLanguageByQuery(
        {},
        false,
    );
    const page = await SettingPageService.findPageByQuery({}, false);
    const service = await ServiceService.findServiceByQuery({}, false);
    const section = await SettingSectionService.findSectionByQuery({}, false);
    if (!service) await ServiceService.createManyService(services);

    //create section ->
    if (!section) await SettingSectionService.createSections(sections);
    //create admin -- >
    if (!user) {
        await User.create({
            name,
            email,
            phone,
            password,
            role: 'admin',
        });
    }
    // create siteSettings --->
    if (!setting) {
        await Setting.create({
            client_side_url:CLIENT_SIDE_URL,
            server_side_url:SERVER_SIDE_URL,
            title: WEBSITE_NAME,
            file_upload_type: FILE_UPLOAD_TYPE,
            currency: {
                code: 'USD',
                symbol: '$',
            },
        });
    }

    if (!language) {
        await Language.create({
            name: 'English',
            code: 'en',
            active: true,
            flag: "https://appstick.s3.ap-southeast-1.amazonaws.com/Car2Go-Pro-storage/vehicle/8WSKB2M4-Flag_of_the_United_States_(DDD-F-416E_specifications).svg.png",
            default: true,
        });
    }
    if (!page) {
        await Page.insertMany(pages);
        console.log('page setting is created successfully.');
    }
};

export const seeders = async () => {
    const adminInfo = {
        name: 'Admin',
        email: 'admin@gmail.com',
        phone: '+8801712345678',
        password: '123456',
    };
    const payload = {
        WEBSITE_NAME: 'TravelStick',
        CLIENT_SIDE_URL: "http://localhost:3000",
        SERVER_SIDE_URL: "http://localhost:3000",
        FILE_UPLOAD_TYPE: "local",
    };
    await seedAdmin(adminInfo, payload);
};
