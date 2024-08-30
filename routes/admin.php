<?php

use App\Http\Controllers\AssetsController;
use App\Http\Controllers\Auth\AuthenticatedAdminSessionController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ConsumptionController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\Admin;
use App\Http\Middleware\AdminGuest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;

Route::middleware(AdminGuest::class)->group(
  function () {
    Route::get('login', [AuthenticatedAdminSessionController::class, 'create'])
      ->name('admin.login');

    Route::post('login', [AuthenticatedAdminSessionController::class, 'adminstore'])
      ->name('admin.store');
  }
);


Route::middleware(['auth', Admin::class])->group(
  function () {
    Route::get('switch-lang', function (Request $request) {
      App::setlocale($request->lang);
      Cache::put('user_locale_' . $request->ip(), $request->lang, 60 * 24 * 30);
      return redirect()->back();
    })->name('switch.lang');

    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    Route::get('/dispach', [DashboardController::class, 'dispach'])->name("admin.dispach");


    Route::post('/toggle-status', [RoomController::class, 'toggleStatus'])->name('rooms.toggle.status');
    Route::post('/edit/{room}', [RoomController::class, 'update'])->name('rooms.update');
    Route::resource('rooms', RoomController::class)->names("rooms")->except(['destroy', 'update']);

    Route::resource('types', TypeController::class)->names("types")->except(['destroy']);

    Route::resource('features', FeatureController::class)->names("features")->except(['create', 'edit', 'show']);

    Route::resource('categorys', CategoryController::class)->names("categorys")->except(['create', 'edit', 'show']);

    Route::post('/toggle-availability', [ServiceController::class, 'toggleAvailability'])->name('services.toggle.availability');
    Route::post('/services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::resource('services', ServiceController::class)->names("services")->except(['update']);

    Route::resource('consumptions', ConsumptionController::class)->names("consumptions")->except(['create', 'edit']);

    Route::post('/searsh-aviable-rooms', [BookingController::class, 'searchAviableRoom'])->name('bookings.searchAviableRoom');
    Route::get('/show-aviable-rooms', [BookingController::class, 'showAviableRooms'])->name('bookings.showAviableRooms');
    Route::get('/historique', [BookingController::class, 'historique'])->name('bookings.historique');
    Route::get('/calendar', [BookingController::class, 'calendar'])->name('bookings.calendar');
    Route::post('/change-status/{id}', [BookingController::class, 'changeStatus'])->name('bookings.change.status');
    Route::resource('bookings', BookingController::class)->names("bookings")->except('destroy');

    Route::post('/events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::resource('events', EventController::class)->names("events")->except(['update', 'show']);

    Route::post('/toggle-Activity', [PromotionController::class, 'toggleActivity'])->name('promotions.toggle.activity');
    Route::post('/promotions/{promo}', [PromotionController::class, 'update'])->name('promotions.update');
    Route::resource('promotions', PromotionController::class)->names("promotions")->except(['update', 'show']);

    Route::get('/factures/send/{id}', [FactureController::class, 'send'])->name('factures.send');
    Route::get('/factures/download/{id}', [FactureController::class, 'download'])->name('factures.download');
    Route::get('/factures/print/{id}', [FactureController::class, 'print'])->name('factures.print');
    Route::post('/bill-settings', [FactureController::class, 'billSettings'])->name('factures.bill.settings');
    Route::resource('factures', FactureController::class)->names("factures");

    Route::resource('roles', RoleController::class)->names("roles")->except('show');

    Route::delete('/messages/delete', [MessageController::class, 'destroyAll'])->name('messages.destroyAll');
    Route::get('/messages/read-all', [MessageController::class, 'readAll'])->name('messages.readAll');
    Route::post('/messages/reply', [MessageController::class, 'reply'])->name('messages.reply');
    Route::resource('messages', MessageController::class)->names("messages");

    Route::resource('users', UserController::class)->names("users")->except(['show', 'edit', 'update']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('admin.profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('admin.profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('admin.profile.destroy');

    Route::prefix('assets')->controller(AssetsController::class)->as('assets.')->group(function () {
      Route::post('/create', 'store')->name('store');
      Route::get('/delete/{id}', 'destroy')->name('delete');
    });

    Route::get('notifications', [NotificationController::class, 'index'])->name("notifications.index");
    Route::get('read-all', [NotificationController::class, 'readAll'])->name("notifications.readAll");
    Route::get('delete-all', [NotificationController::class, 'deleteAll'])->name("notifications.deleteAll");
    Route::post('read-notification', [NotificationController::class, 'read'])->name("notifications.read");

    Route::post('logout', [AuthenticatedAdminSessionController::class, 'destroy'])
      ->name('admin.logout');
  }
);


Route::get('{catchall}', function () {
  dump('subdomain not dound');
})->where('catchall', '(.*)');
