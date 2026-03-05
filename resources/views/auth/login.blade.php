@extends('layouts.app')

@section('title', 'Вход — SHlist')

@section('main-class', 'auth-page')

@push('vite')
    @vite(['resources/css/auth.css'])
@endpush

@section('content')
    <div class="auth-card">
        <h1 class="auth-card__title">Вход в аккаунт</h1>

        {{-- Статусное сообщение (например, после сброса пароля) --}}
        @if (session('status'))
            <div class="auth-status">{{ session('status') }}</div>
        @endif

        {{-- Блок ошибок --}}
        @if ($errors->any())
            <div class="auth-errors">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="/login">
            @csrf

            <div class="auth-form__group">
                <label for="email" class="auth-form__label">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value="{{ old('email') }}"
                    class="auth-form__input @error('email') is-invalid @enderror"
                    placeholder="you@example.com"
                    required
                    autofocus
                    autocomplete="username"
                >
                @error('email')
                    <div class="auth-form__error">{{ $message }}</div>
                @enderror
            </div>

            <div class="auth-form__group">
                <label for="password" class="auth-form__label">Пароль</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    class="auth-form__input @error('password') is-invalid @enderror"
                    placeholder="••••••••"
                    required
                    autocomplete="current-password"
                >
                @error('password')
                    <div class="auth-form__error">{{ $message }}</div>
                @enderror
            </div>

            <div class="auth-form__group">
                <label class="auth-form__remember">
                    <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}>
                    Запомнить меня
                </label>
            </div>

            <button type="submit" class="auth-form__submit">Войти</button>
        </form>

        <div class="auth-card__footer">
            Ещё нет аккаунта? <a href="/register">Зарегистрироваться</a>
        </div>
    </div>
@endsection

