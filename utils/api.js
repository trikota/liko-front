import { AsyncStorage } from 'react-native';

import { checkInternetConnection } from './helpers'
import Config from '../constants/Сonfig'
import DateTime from 'luxon/src/datetime.js'


const cache = {};
const cacheKeysTsAdded = {};
const fetchPromisesHanging = {};
const objCache = {};

export const getCache = (key, maxLife) => {
    return getCacheExpired(key, maxLife) ? undefined : cache[key];
}

export const setCache = (key, value) => {
    cache[key] = value;
    cacheKeysTsAdded[key] = (new Date()).getTime();
}

export const clearCache = () => {
    for (const prop of Object.getOwnPropertyNames(cache)) {
        delete cache[prop];
    }
    for (const prop of Object.getOwnPropertyNames(cacheKeysTsAdded)) {
        delete cacheKeysTsAdded[prop];
    }
}

export const getCacheExpired = (key, maxLife) => {
    const lastCached = cacheKeysTsAdded[key];
    if(!lastCached)
        return true;
    const now = (new Date()).getTime();
    return (maxLife) ? (now - lastCached > maxLife) : false;
}


export const setNavigation = (navigation) => {
    objCache.navigation = navigation;
}


function objToQueryString(obj) {
    const keyValuePairs = [];
    for (const key in obj){
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return keyValuePairs.join('&');
}

export const getUser = async () => {
    return JSON.parse(await AsyncStorage.getItem('user'));
}

export const apiPost = async (endpoint, params, publicApi) => {
    const url = Config.api_protocol + '://' + Config.api_host + '/' + endpoint + '/';
    params = params ? params : {};
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
    if (typeof(publicApi) == 'undefined'){
        if (await getUser())
            publicApi = false;
    }
    if(!publicApi)
        headers['Authorization'] = 'Token ' + ((await getUser()).token);
    
    const hangingPromiseKey = url + JSON.stringify(headers) + 'POST' + JSON.stringify(params);
    if(typeof(fetchPromisesHanging[hangingPromiseKey]) == 'undefined'){
        fetchPromisesHanging[hangingPromiseKey] = fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(params),
        }).then(resp => {fetchPromisesHanging[hangingPromiseKey] = undefined;
                         if ((!publicApi) && (resp.status == 403) && (typeof(objCache.navigation) != 'undefined')){
                             AsyncStorage.removeItem('user');
                             clearCache();
                             objCache.navigation.navigate('Auth');
                             return null;
                         }
                         return resp})
          .catch((e)=>{
            if ((typeof(objCache.navigation) != 'undefined'))
                checkInternetConnection().then(state => {
                    const isInternetReachable = state ? (state.isInternetReachable) : false;
                    if(!isInternetReachable){
                        objCache.navigation.navigate('NoInternet');
                    }
                });
            throw e;
          });
    }
    return fetchPromisesHanging[hangingPromiseKey];
};

export const apiGet = async (endpoint, params, publicApi) => {
    let url = Config.api_protocol + '://' + Config.api_host + '/' + endpoint + '/';
    if(params)
        if(Object.keys(params).length)
            url += '?' + objToQueryString(params);
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
    if(!publicApi)
        headers['Authorization'] = 'Token ' + ((await getUser()).token);
    
    const hangingPromiseKey = url + JSON.stringify(headers);
    if(typeof(fetchPromisesHanging[hangingPromiseKey]) == 'undefined'){
        fetchPromisesHanging[hangingPromiseKey] = fetch(url, {
            headers: headers
        }).then(resp => {fetchPromisesHanging[hangingPromiseKey] = undefined;
                         if ((!publicApi) && (resp.status == 403) && (typeof(objCache.navigation) != 'undefined')){
                            AsyncStorage.removeItem('user');
                            clearCache();
                            objCache.navigation.navigate('Auth');
                            return null;
                         }
                         return resp})
          .catch((e)=>{
            if ((typeof(objCache.navigation) != 'undefined'))
                checkInternetConnection().then(state => {
                    const isInternetReachable = state ? (state.isInternetReachable) : false;
                    if(!isInternetReachable){
                        objCache.navigation.navigate('NoInternet');
                    }
                });
            throw e;
          });
    }
    return fetchPromisesHanging[hangingPromiseKey];
};

export const getRegions = async () => {
    const cacheKey = 'regions';
    if(getCache(cacheKey))
        return Promise.resolve(getCache(cacheKey));
    const endpoint = 'api/v1/regions';
    return apiGet(endpoint, {}, true)
		.then((response) => response.json())
        .then((responseJson) => {
            setCache(cacheKey, responseJson.results);
            return getCache(cacheKey);
        });
};

export const getSpecializations = async () => {
    const cacheKey = 'specializations';
    if(getCache(cacheKey))
        return Promise.resolve(getCache(cacheKey));
    const endpoint = 'api/v1/specializations';
    return apiGet(endpoint, {}, true)
		.then((response) => response.json())
        .then((responseJson) => {
            setCache(cacheKey, responseJson.results);
            return getCache(cacheKey);
        });
};

export const getAllFillables = async (cacheMaxLife) => {
    const cacheKey = 'fillables';
    if(getCache(cacheKey, cacheMaxLife))
        return Promise.resolve(getCache(cacheKey, cacheMaxLife));
    const endpoint = 'api/v1/fillables';
    return apiGet(endpoint, {})
		.then((response) => response.json())
        .then((responseJson) => {
            setCache(cacheKey, responseJson.results);
            return getCache(cacheKey, cacheMaxLife);
        });
};

export const getFillable = async (id) => {
    const cacheKey = 'fillable_' + id;
    if(getCache(cacheKey))
        return Promise.resolve(getCache(cacheKey));
    const endpoint = 'api/v1/fillable/' + id;
    return apiGet(endpoint, {})
		.then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson)
            //if(responseJson.fillable_questions)
            //    responseJson.fillable_questions.sort((a,b) => a.position - b.position);
            setCache(cacheKey, responseJson);
            return getCache(cacheKey);
        });
};

export const getCity = async (cityId) => {
    const cacheKey = 'city_' + cityId;
    if(getCache(cacheKey))
        return Promise.resolve(getCache(cacheKey));
    const endpoint = 'api/v1/city/' + cityId;
    return apiGet(endpoint, {}, true)
		.then((response) => response.json())
        .then((responseJson) => {
            setCache(cacheKey, responseJson);
            return getCache(cacheKey);
        });
};

export const getCityWorkPlaces = async (cityId) => {
    return getCity(cityId).then(city => city.city_work_places);
};

export const submitFill = async (fillable, answerState, startedTs) => {
    const endpoint = 'api/v1/fill';
    return apiPost(endpoint, {'fillable': fillable.id,
                              'answer_state': answerState,
                              'started_at': startedTs}, false)
		.then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        });
};

export const submitWithdraw = async (card_number) => {
    const endpoint = 'api/v1/withdraw';
    return apiPost(endpoint, {card_number}, false)
		.then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        });
};

export const submitAnalytics = async (name_tag, data) => {
    if (typeof(data) == 'undefined')
        data = {};
    const endpoint = 'api/v1/submit_analytics_event';
    return apiPost(endpoint, {name_tag: name_tag, data: JSON.stringify(data)}, undefined)
		.then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        });
};

export const submitVerifyEmail = async (email) => {
    const endpoint = 'api/v1/verify_user';
    return apiPost(endpoint, {email}, false)
		.then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        });
};

export const sendMessage = async (company, text) => {
    const endpoint = 'api/v1/send_chat_message';
    return apiPost(endpoint, {'company_id': company.id,
                              'text': text}, false)
		.then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        });
};

export const getAllFills = async (cacheMaxLife) => {
    const cacheKey = 'fills';
    if(getCache(cacheKey, cacheMaxLife))
        return Promise.resolve(getCache(cacheKey, cacheMaxLife));
    const endpoint = 'api/v1/fills';
    return apiGet(endpoint, {})
		.then((response) => response.json())
        .then((responseJson) => {
            setCache(cacheKey, responseJson.results);
            return getCache(cacheKey, cacheMaxLife);
        });
};

export const getAllAds = async (cacheMaxLife) => {
    const cacheKey = 'ads';
    if(getCache(cacheKey, cacheMaxLife))
        return Promise.resolve(getCache(cacheKey, cacheMaxLife));
    
    const user = await getUser();
    const created_ago = DateTime.utc().diff(DateTime.fromISO(user.created_at), 'days').toObject();

    const endpoint = 'api/v1/ad';
    return apiGet(endpoint, {})
		.then((response) => response.json())
        .then((responseJson) => {
            let ads = responseJson.results;
            if (created_ago < 14) {
                for(let i=0;i<ads.length;i++)
                    if(ads[i].company.id == user.verifier_company.id)
                        ads[i].position = -1;
            }
            ads = ads.sort((a, b) => a.position - b.position)
            setCache(cacheKey, ads);
            return getCache(cacheKey, cacheMaxLife);
        });
};

export const getAllWithdraws = async (cacheMaxLife) => {
    const cacheKey = 'withdraws';
    if(getCache(cacheKey, cacheMaxLife))
        return Promise.resolve(getCache(cacheKey, cacheMaxLife));
    const endpoint = 'api/v1/withdraws';
    return apiGet(endpoint, {})
		.then((response) => response.json())
        .then((responseJson) => {
            setCache(cacheKey, responseJson.results);
            return getCache(cacheKey, cacheMaxLife);
        });
};

export const getAllFaqs = async (cacheMaxLife) => {
    const cacheKey = 'faqs';
    if(getCache(cacheKey, cacheMaxLife))
        return Promise.resolve(getCache(cacheKey, cacheMaxLife));
    const endpoint = 'api/v1/faq';
    return apiGet(endpoint, {})
		.then((response) => response.json())
        .then((responseJson) => {
            setCache(cacheKey, responseJson.results);
            return getCache(cacheKey, cacheMaxLife);
        });
};

export const getAllCompanies = async (cacheMaxLife) => {
    const cacheKey = 'companies';
    if(getCache(cacheKey, cacheMaxLife))
        return Promise.resolve(getCache(cacheKey, cacheMaxLife));
    const endpoint = 'api/v1/companies';
    return apiGet(endpoint, {})
		.then((response) => response.json())
        .then((responseJson) => {
            setCache(cacheKey, responseJson.results);
            return getCache(cacheKey, cacheMaxLife);
        });
};

export const getGlobals = async (cacheMaxLife) => {
    const cacheKey = 'globals';
    if(getCache(cacheKey, cacheMaxLife))
        return Promise.resolve(getCache(cacheKey, cacheMaxLife));
    const endpoint = 'api/v1/globals/1';
    return apiGet(endpoint, {})
		.then((response) => response.json())
        .then((responseJson) => {
            setCache(cacheKey, responseJson);
            return getCache(cacheKey, cacheMaxLife);
        });
};

export const addFill = async (fill) => {
    const cacheKey = 'fills';
    const fillsCache = getCache(cacheKey);
    if(typeof(fillsCache) == 'undefined')
        return false;
    for(let i=0;i<fillsCache.length;i++)
        if(fillsCache[i].id == fill.id)
            return false;
    fillsCache.push(fill);
    return true;
};

export const addWithdraw = async (withdraw) => {
    const cacheKey = 'withdraws';
    const withdrawsCache = getCache(cacheKey);
    if(typeof(withdrawsCache) == 'undefined')
        return false;
    for(let i=0;i<withdrawsCache.length;i++)
        if(withdrawsCache[i].id == withdraw.id)
            return false;
    withdrawsCache.push(withdraw);
    return true;
};
