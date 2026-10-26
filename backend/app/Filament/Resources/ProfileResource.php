<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProfileResource\Pages;
use App\Models\Profile;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ProfileResource extends Resource
{
    protected static ?string $model = Profile::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-circle';

    protected static ?string $navigationLabel = 'Profile';

    protected static ?string $modelLabel = 'profile';

    protected static ?int $navigationSort = 1;

    /** There is only one profile, so creating more is switched off once it exists. */
    public static function canCreate(): bool
    {
        return Profile::query()->count() === 0;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')->required()->maxLength(255),
            Forms\Components\TextInput::make('role')->required()->maxLength(255),
            Forms\Components\TextInput::make('location')->required()->maxLength(255),
            Forms\Components\TextInput::make('headline')->required()->maxLength(255),
            Forms\Components\Textarea::make('bio')->required()->rows(4)->columnSpanFull(),
            Forms\Components\TextInput::make('github_url')->url()->maxLength(255),
            Forms\Components\TextInput::make('linkedin_url')->url()->maxLength(255),
            Forms\Components\TextInput::make('resume_url')->url()->maxLength(255),
            Forms\Components\FileUpload::make('photo_path')->label('Photo')->image()->disk('public')->directory('profile')->imageEditor()->columnSpanFull(),
            Forms\Components\FileUpload::make('gallery')->label('Gallery photos (shown in the Moments section)')->image()->multiple()->reorderable()->maxFiles(12)->disk('public')->directory('profile/gallery')->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable(),
                Tables\Columns\TextColumn::make('role'),
                Tables\Columns\TextColumn::make('location'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageProfiles::route('/'),
        ];
    }
}
