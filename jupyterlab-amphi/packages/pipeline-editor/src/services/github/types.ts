export interface GitHubRepository {
    id: number;
    name: string;
    full_name: string;
    owner: {
        login: string;
        id: number;
        avatar_url: string;
        html_url: string;
    };
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    git_url: string;
    ssh_url: string;
    clone_url: string;
    homepage: string | null;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string | null;
    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    forks_count: number;
    mirror_url: string | null;
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;
    license: {
        key: string;
        name: string;
        spdx_id: string;
        url: string | null;
    } | null;
    forks: number;
    open_issues: number;
    watchers: number;
    default_branch: string;
}

export interface GitHubCommit {
    sha: string;
    commit: {
        author: {
            name: string;
            email: string;
            date: string;
        };
        committer: {
            name: string;
            email: string;
            date: string;
        };
        message: string;
        tree: {
            sha: string;
            url: string;
        };
        url: string;
        comment_count: number;
    };
    url: string;
    html_url: string;
}

export interface CreateFileParams {
    owner: string;
    repo: string;
    path: string;
    message: string;
    content: string;
    committer: {
        name: string;
        email: string;
    };
    author: {
        name: string;
        email: string;
    };
}