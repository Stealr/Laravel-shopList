// /**
//  * Централизованные Query Keys для TanStack Query
//  *
//  * Структура:
//  * - Каждая сущность имеет свой namespace
//  * - Используется иерархическая структура для удобной инвалидации
//  * - Функции возвращают readonly массивы для type safety
//  */

// import type { components, operations } from '@/react/types/api.d.ts';

// // Type aliases для параметров
// type Pageable = components['schemas']['Pageable'];
// type BreedFilters = components['schemas']['BreedFilters'];
// type GetAllListingsParams = operations['getAllListings']['parameters']['query'];
// type GetAllDogProfilesParams = operations['getAllDogProfiles']['parameters']['query'];
// type GetAllServiceListingsParams = operations['getAllServiceListings']['parameters']['query'];

// export const queryKeys = {
//     // === FAVORITES ===
//     favorites: {
//         all: ['favorites'] as const,
//         serviceListings: () => [...queryKeys.favorites.all, 'service-listings'] as const,
//         puppies: () => [...queryKeys.favorites.all, 'puppies'] as const,
//         listings: () => [...queryKeys.favorites.all, 'listings'] as const,
//         dogProfiles: () => [...queryKeys.favorites.all, 'dogProfiles'] as const,
//     },

//     // === LISTINGS ===
//     listings: {
//         all: ['listings'] as const,
//         lists: () => [...queryKeys.listings.all, 'list'] as const,
//         list: (params: GetAllListingsParams) => [...queryKeys.listings.lists(), params] as const,
//         details: () => [...queryKeys.listings.all, 'detail'] as const,
//         detail: (id: number) => [...queryKeys.listings.details(), id] as const,
//         // Specific status filters
//         withStatus: (status?: 'ACTIVE' | 'ARCHIVED' | 'SOLD') =>
//             [...queryKeys.listings.all, status] as const,
//         puppiesSellInfo: (listingId: number) => ['listingPuppiesSellInfo', listingId] as const,
//     },

//     // === SERVICE LISTINGS ===
//     serviceListings: {
//         all: ['service-listings'] as const,
//         lists: () => [...queryKeys.serviceListings.all, 'list'] as const,
//         list: (params: GetAllServiceListingsParams) =>
//             [...queryKeys.serviceListings.lists(), params] as const,
//         details: () => [...queryKeys.serviceListings.all, 'detail'] as const,
//         detail: (id: number) => [...queryKeys.serviceListings.details(), id] as const,
//         // User specific service listings
//         user: {
//             all: (userId?: string) => ['serviceListings', userId] as const,
//             withStatus: (userId?: string, status?: 'ACTIVE' | 'ARCHIVED' | 'SOLD') =>
//                 [...queryKeys.serviceListings.user.all(userId), status] as const,
//         },
//         // Service listings to review (user chatted in)
//         toReview: () => [...queryKeys.serviceListings.all, 'to-review'] as const,
//     },

//     // === BREEDS ===
//     breeds: {
//         all: ['breeds'] as const,
//         lists: () => [...queryKeys.breeds.all, 'list'] as const,
//         list: (pageable: Pageable, filters: BreedFilters) =>
//             [...queryKeys.breeds.lists(), pageable, filters] as const,
//         details: () => [...queryKeys.breeds.all, 'detail'] as const,
//         detail: (id: number) => [...queryKeys.breeds.details(), id] as const,
//     },

//     // === DOG PROFILES ===
//     dogProfiles: {
//         all: ['dogProfiles'] as const,
//         lists: () => [...queryKeys.dogProfiles.all, 'list'] as const,
//         list: (params: GetAllDogProfilesParams) =>
//             [...queryKeys.dogProfiles.lists(), params] as const,
//         details: () => [...queryKeys.dogProfiles.all, 'detail'] as const,
//         detail: (id: number) => [...queryKeys.dogProfiles.details(), id] as const,
//         cards: () => [...queryKeys.dogProfiles.all, 'card'] as const,
//         card: (id: number) => [...queryKeys.dogProfiles.cards(), id] as const,
//         pedigrees: () => [...queryKeys.dogProfiles.all, 'pedigree'] as const,
//         pedigree: (id: number, params?: { depth?: number }) =>
//             [...queryKeys.dogProfiles.pedigrees(), id, params] as const,
//         // User specific dog profiles
//         user: (userId: string) => ['userDogProfiles', userId] as const,
//     },

//     // === USER DATA ===
//     user: {
//         // Current user data
//         current: () => ['currentUser'] as const,
//         profile: () => ['userProfile'] as const,
//         phone: () => ['userPhone'] as const,
//         card: () => ['meUserCard'] as const,

//         // Current user's dog profiles
//         dogProfiles: {
//             me: () => ['meDogProfiles'] as const,
//         },

//         // Public user data
//         public: {
//             profile: (userId: string) => ['userProfile', userId] as const,
//             miniCard: (userId: string) => ['userMiniCard', userId] as const,
//             serviceListings: (userId: string, status?: 'ACTIVE' | 'ARCHIVED') =>
//                 ['userServiceListings', userId, status] as const,
//             puppyListings: (userId: string, status?: 'ACTIVE' | 'ARCHIVED') =>
//                 ['userPuppyListings', userId, status] as const,
//             reviews: (userId: string) => ['userReviews', userId] as const,
//             dogProfiles: (userId: string) => ['userDogProfiles', userId] as const,
//         },

//         // User selectors
//         selectors: {
//             all: ['usersSelector'] as const,
//             search: (query?: string) => [...queryKeys.user.selectors.all, query] as const,
//         },
//     },

//     // === MONETIZATION ===
//     monetization: {
//         limits: () => ['monetizationLimits'] as const,
//         premiumInfo: () => ['premium-info'] as const,
//     },

//     // === REVIEWS (ME) ===
//     reviews: {
//         // Reviews on me
//         onMe: () => ['reviewsOnMe'] as const,
//         // Reviews written by me
//         writtenByMe: () => ['writtenReviewsByMe'] as const,
//         // Breed reviews written by me
//         writtenBreedsByMe: () => ['writtenBreedReviewsByMe'] as const,
//         // Purchased puppies (for review purposes)
//         purchasedPuppies: () => ['myPurchasedPuppies'] as const,
//     },

//     // === FILTERS ===
//     filters: {
//         options: () => ['filterOptions'] as const,
//         cities: {
//             all: ['citiesSearch'] as const,
//             search: (search?: string, pageable?: Pageable) =>
//                 [...queryKeys.filters.cities.all, search, pageable] as const,
//         },
//     },

//     // === SELECTORS ===
//     selectors: {
//         breeds: {
//             search: (search?: string, pageable?: Pageable) =>
//                 ['breedsSearch', search, pageable] as const,
//         },
//         services: {
//             nameSearch: (query?: string, pageable?: Pageable) =>
//                 ['serviceNameSearch', query, pageable] as const,
//         },
//         users: {
//             infoSearch: (query: string) => ['userInfoSearch', query] as const,
//         },
//         dogs: {
//             infoSearch: (query: string, gender?: 'MALE' | 'FEMALE', breedId?: number) =>
//                 ['dogInfoSearch', query, gender, breedId] as const,
//         },
//         genetic: {
//             testTypes: () => ['geneticTestTypes'] as const,
//         },
//         classification: {
//             systems: () => ['classificationSystems'] as const,
//         },
//         breedVariations: (breedId: number) => ['breedVariations', breedId] as const,
//         breedSizes: () => ['breedSizes'] as const,
//     },

//     // === PUPPIES ===
//     puppies: {
//         all: ['puppies'] as const,
//         // Наследуется от favorites и user публичных данных
//     },

//     // === CHATS ===
//     chats: {
//         all: ['chats'] as const,
//         lists: () => [...queryKeys.chats.all, 'list'] as const,
//         list: () => [...queryKeys.chats.lists()] as const,
//         details: () => [...queryKeys.chats.all, 'detail'] as const,
//         chat: (chatId: number) => [...queryKeys.chats.details(), chatId] as const,
//         messages: () => [...queryKeys.chats.all, 'messages'] as const,
//         chatMessages: (chatId: number, page?: number) =>
//             [...queryKeys.chats.messages(), chatId, page] as const,
//         unreadCount: () => [...queryKeys.chats.all, 'unread-count'] as const,
//     },

//     // === NOTIFICATIONS ===
//     notifications: {
//         all: () => ['notifications'] as const,
//         unreadCount: () => ['notifications', 'unread-count'] as const,
//     },
// } as const;

// /**
//  * Utility функции для работы с query keys
//  */
// export const queryUtils = {
//     /**
//      * Получить все ключи для конкретной сущности
//      */
//     getAllKeysFor: (entity: keyof typeof queryKeys) => {
//         return queryKeys[entity];
//     },

//     /**
//      * Создать ключ для инвалидации всех запросов определенного типа
//      */
//     invalidateAll: (entity: keyof typeof queryKeys) => {
//         const entityKeys = queryKeys[entity];
//         if ('all' in entityKeys) {
//             return entityKeys.all;
//         }
//         throw new Error(`Entity ${String(entity)} doesn't have 'all' key`);
//     },
// };

// /**
//  * Legacy query keys для обратной совместимости
//  * Постепенно заменять на новые структурированные ключи
//  */
// export const legacyKeys = {
//     // Старые ключи, которые используются в существующем коде
//     breed: (id: number) => ['breed', id] as const,
//     listing: (params: operations['getListingById']['parameters']['path']) =>
//         ['listing', params] as const,
//     dogProfile: (id: number) => ['dogProfile', id] as const,
//     dogProfileCard: (id: number) => ['dogProfileCard', id] as const,
// } as const;
