<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProjectResource\Pages;
use App\Models\Project;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static ?string $navigationIcon = 'heroicon-o-code-bracket-square';

    protected static ?string $navigationLabel = 'Projects';

    protected static ?string $modelLabel = 'project';

    protected static ?int $navigationSort = 6;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\FileUpload::make('cover_path')->label('Cover image')->image()->imageEditor()->disk('public')->directory('projects')->columnSpanFull(),
            Forms\Components\TextInput::make('code')->required()->maxLength(255),
            Forms\Components\TextInput::make('tag')->required()->maxLength(255),
            Forms\Components\TextInput::make('title')->required()->maxLength(255),
            Forms\Components\Textarea::make('problem')->required()->rows(3)->columnSpanFull(),
            Forms\Components\Textarea::make('built_with')->required()->rows(3)->columnSpanFull(),
            Forms\Components\Textarea::make('result')->required()->rows(3)->columnSpanFull(),
            Forms\Components\Textarea::make('case_study')->label('Full case study (optional, blank line = new paragraph)')->rows(10)->columnSpanFull(),
            Forms\Components\FileUpload::make('gallery')->label('Screenshots')->image()->multiple()->reorderable()->maxFiles(12)->disk('public')->directory('projects/gallery')->columnSpanFull(),
            Forms\Components\TextInput::make('slug')->helperText('Leave empty. It is made from the title.')->maxLength(255),
            Forms\Components\TextInput::make('github_url')->url()->maxLength(255),
            Forms\Components\TextInput::make('demo_url')->url()->maxLength(255),
            Forms\Components\Toggle::make('is_published')->label('Show on the website')->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_path')->label('Cover')->disk('public'),
                Tables\Columns\TextColumn::make('code'),
                Tables\Columns\TextColumn::make('title')->searchable(),
                Tables\Columns\TextColumn::make('tag'),
                Tables\Columns\IconColumn::make('is_published')->label('Live')->boolean(),
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
            'index' => Pages\ManageProjects::route('/'),
        ];
    }
}
