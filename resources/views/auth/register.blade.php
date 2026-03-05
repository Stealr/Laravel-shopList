@extends('layouts.app')

@section('title', 'Регистрация — SHlist')

@section('main-class', 'auth-page')

@push('vite')
    @vite(['resources/css/auth.css'])
@endpush

@section('content')
    <div class="auth-card">
        <h1 class="auth-card__title">Регистрация</h1>

        @if ($errors->any())
            <div class="auth-errors">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="/register">
            @csrf

            <div class="auth-form__group">
                <label for="name" class="auth-form__label">Имя</label>
                <input type="text" id="name" name="name" value="{{ old('name') }}"
                    class="auth-form__input @error('name') is-invalid @enderror"
                    placeholder="Иван Иванов" required autofocus autocomplete="name">
                @error('name')
                    <div class="auth-form__error">{{ $message }}</div>
                @enderror
            </div>

            <div class="auth-form__group">
                <label for="email" class="auth-form__label">Email</label>
                <input type="email" id="email" name="email" value="{{ old('email') }}"
                    class="auth-form__input @error('email') is-invalid @enderror"
                    placeholder="you@example.com" required autocomplete="username">
                @error('email')
                    <div class="auth-form__error">{{ $message }}</div>
                @enderror
            </div>

            <div class="auth-form__group">
                <label for="password" class="auth-form__label">Пароль</label>
                <input type="password" id="password" name="password"
                    class="auth-form__input @error('password') is-invalid @enderror"
                    placeholder="Минимум 8 символов" required autocomplete="new-password">
                @error('password')
                    <div class="auth-form__error">{{ $message }}</div>
                @enderror
            </div>

            <div class="auth-form__group">
                <label for="password_confirmation" class="auth-form__label">Подтверждение пароля</label>
                <input type="password" id="password_confirmation" name="password_confirmation"
                    class="auth-form__input" placeholder="Повторите пароль"
                    required autocomplete="new-password">
            </div>

            <button type="submit" class="auth-form__submit">Создать аккаунт</button>
        </form>

        <div class="auth-card__footer">
            Уже есть аккаунт? <a href="/login">Войти</a>
        </div>
    </div>
@endsection

