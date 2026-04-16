<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Pest Configuration
|--------------------------------------------------------------------------
| Extends all tests in Feature/ with the Laravel TestCase so that $this
| has access to postJson(), getJson(), actingAs(), assertDatabaseHas(), etc.
*/

uses(Tests\TestCase::class)->in('Feature');
