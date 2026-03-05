<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>react</title>

    @viteReactRefresh
    @vite(['resources/js/room/src/react/main.tsx'])

</head>

<body>
    <div id="room-root"></div>

    <script>
        window.__USER__ = @json(auth()->user());
    </script>
</body>

</html>