'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button, Badge, Input } from '../../atoms';
import { Card } from '../../molecules';
import type { AppConfig } from '../../tools/AppBuilder/types';
import { StorageManager } from '../../tools/AppBuilder/utils/StorageManager';

interface SavedApp {
  key: string;
  config: AppConfig;
  savedAt: string;
}

export interface AppsSlotProps {
  currentApp?: AppConfig;
  onAppSelect: (app: SavedApp) => void;
  onAppDelete: (key: string, name: string) => void;
  onNewApp: () => void;
}

export function AppsSlot({
  currentApp,
  onAppSelect,
  onAppDelete,
  onNewApp,
}: AppsSlotProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Get saved apps from localStorage
  const savedApps = useMemo((): SavedApp[] => {
    try {
      const apps: SavedApp[] = [];
      const keys = StorageManager.listApps();
      for (const key of keys) {
        const config = StorageManager.loadApp(key);
        if (config) {
          apps.push({
            key,
            config,
            savedAt: config.metadata?.createdAt || 'Unknown',
          });
        }
      }
      return apps;
    } catch {
      return [];
    }
  }, [currentApp]);

  // Filter saved apps based on search
  const filteredSavedApps = useMemo(() => {
    if (!searchQuery.trim()) return savedApps;
    const query = searchQuery.toLowerCase();
    return savedApps.filter(
      (app) =>
        app.config.name.toLowerCase().includes(query) ||
        app.config.description?.toLowerCase().includes(query)
    );
  }, [savedApps, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Saved Apps
          </h3>
          <Badge variant="secondary" size="sm">
            {savedApps.length}
          </Badge>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="w-full mb-3"
          onClick={onNewApp}
        >
          + New App
        </Button>
        <Input
          type="text"
          placeholder="Search apps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="sm"
        />
      </div>

      {/* Apps List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredSavedApps.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
            {searchQuery ? 'No apps match your search' : 'No saved apps yet'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSavedApps.map((app) => (
              <Card
                key={app.key}
                className={`cursor-pointer transition-colors ${
                  currentApp?.name === app.config.name
                    ? 'ring-2 ring-blue-500 border-blue-500'
                    : 'hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => onAppSelect(app)}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                      {app.config.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppDelete(app.key, app.config.name);
                      }}
                      className="text-red-600 hover:text-red-700 -mr-2"
                    >
                      ×
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{app.config.features.length} features</span>
                    <span>•</span>
                    <span>
                      {new Date(app.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
