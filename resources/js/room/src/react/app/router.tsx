import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import paths from './paths.ts';
import Provider from './Provider.tsx';
import MainLayout from './layouts/MainLayout/MainLayout.js';

const Home = lazy(() => import('./routes/Home/Home.tsx'));
const Apps = lazy(() => import('./routes/Apps/Apps.tsx'));
const Files = lazy(() => import('./routes/Files/Files.tsx'));
const Projects = lazy(() => import('./routes/Projects/Projects.tsx'));
const Learn = lazy(() => import('./routes/Learn/Learn.tsx'));
const Profile = lazy(() => import('./routes/Profile/Profile.tsx'));

export const router = createBrowserRouter(
    [
        {
            element: <Provider />,
            children: [
                {
                    element: <MainLayout />,
                    children: [
                        {
                            path: paths.home,
                            element: (
                                <Suspense fallback={<>Загрузка...</>}>
                                    <Home />
                                </Suspense>
                            ),
                        },
                        {
                            path: paths.apps,
                            element: (
                                <Suspense fallback={<>Загрузка...</>}>
                                    <Apps />
                                </Suspense>
                            ),
                        },
                        {
                            path: paths.files,
                            element: (
                                <Suspense fallback={<>Загрузка...</>}>
                                    <Files />
                                </Suspense>
                            ),
                        },
                        {
                            path: paths.projects,
                            element: (
                                <Suspense fallback={<>Загрузка...</>}>
                                    <Projects />
                                </Suspense>
                            ),
                        },
                        {
                            path: paths.learn,
                            element: (
                                <Suspense fallback={<>Загрузка...</>}>
                                    <Learn />
                                </Suspense>
                            ),
                        },
                        {
                            path: paths.profile,
                            element: (
                                <Suspense fallback={<>Загрузка...</>}>
                                    <Profile />
                                </Suspense>
                            ),
                        },
                    ],
                },
            ],
        },
    ],
    { basename: '/account' }
);
