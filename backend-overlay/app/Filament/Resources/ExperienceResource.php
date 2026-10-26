<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ExperienceResource\Pages;
use App\Models\Experience;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ExperienceResource extends Resource
{
    protected static ?string $model = Experience::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office';

    protected static ?string $navigationLabel = 'Experience';

    protected static ?string $modelLabel = 'experience';

    protected static ?int $navigationSort = 7;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Select::make('type')->options(['INTERNSHIP' => 'INTERNSHIP', 'JOB' => 'JOB', 'LEADERSHIP' => 'LEADERSHIP', 'FREELANCE' => 'FREELANCE'])->required(),
            Forms\Components\TextInput::make('role')->required()->maxLength(255),
            Forms\Components\TextInput::make('org')->required()->maxLength(255),
            Forms\Components\Textarea::make('summary')->required()->rows(3)->columnSpanFull(),
            Forms\Components\FileUpload::make('image_path')->label('Photo (optional)')->image()->disk('public')->directory('experience')->columnSpanFull(),

        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('type')->badge(),
                Tables\Columns\TextColumn::make('role')->searchable(),
                Tables\Columns\TextColumn::make('org'),
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
            'index' => Pages\ManageExperiences::route('/'),
        ];
    }
}
