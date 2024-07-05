import create from 'zustand';
import {fetchGitHubUsers} from './lib/utils';

interface SearchState {
    searchTerm: string;
    searchResults: any[];
    isLoading: boolean;
    search: (term: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set, get) => ({
    searchTerm: '',
    searchResults: [],
    isLoading: false,
    search: async (term) => {
        set({searchTerm: term, isLoading: true});

        const results = await fetchGitHubUsers(term);
        set({searchResults: results, isLoading: false});
    },
}));