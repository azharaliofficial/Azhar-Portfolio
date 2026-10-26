<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AcademicResource\Pages;
use App\Models\Academic;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class AcademicResource extends Resource
{
    protected static ?string $model = Academic::class;

    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';

    protected static ?string $navigationLabel = 'Academic cards';

    protected static ?string $modelLabel = 'academic card';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('position')->options(['tl' => 'Top left', 'tr' => 'Top right', 'bl' => 'Bottom left', 'br' => 'Bottom right'])->required(),
            Forms\Components\TextInput::make('kind')->required()->maxLength(255),
            Forms\Components\TextInput::make('title')->required()->maxLength(255),
            Forms\Components\TextInput::make('subtitle')->required()->maxLength(255),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('position')->badge(),
                Tables\Columns\TextColumn::make('kind'),
                Tables\Columns\TextColumn::make('title')->searchable(),
                Tables\Columns\TextColumn::make('subtitle'),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
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
            'index' => Pages\ManageAcademics::route('/'),
        ];
    }
}
