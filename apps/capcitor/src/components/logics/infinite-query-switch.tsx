import {
  CreateInfiniteQueryResult,
  InfiniteQueryObserverLoadingErrorResult,
  InfiniteQueryObserverLoadingResult,
  InfiniteQueryObserverRefetchErrorResult,
  InfiniteQueryObserverSuccessResult,
} from '@tanstack/solid-query';
import { Component, JSX, Match, Switch, createEffect } from 'solid-js';

export interface IsLoadingComponentProps {
  query: InfiniteQueryObserverLoadingResult;
}

export interface IsErrorComponentProps {
  query: InfiniteQueryObserverLoadingErrorResult | InfiniteQueryObserverRefetchErrorResult;
}

export interface IsSuccessComponentProps<TData> {
  query: InfiniteQueryObserverSuccessResult<TData>;
}

interface InfiniteQuerySwitchProps<TData> {
  query: CreateInfiniteQueryResult<TData>;
  isLoading?: JSX.Element | Component<IsLoadingComponentProps>;
  isError?: JSX.Element | Component<IsErrorComponentProps>;
  isSuccess?: JSX.Element | Component<IsSuccessComponentProps<TData>>;
}

const InfiniteQuerySwitch = <TData,>(props: InfiniteQuerySwitchProps<TData>) => {
  if (import.meta.env.MODE === 'development') {
    createEffect(() => {
      console.log(props.query.status, props.query.data);
    });
  }

  return (
    <Switch>
      <Match when={props.query.isLoading}>
        {typeof props.isLoading === 'function' ? (
          <props.isLoading query={props.query as IsLoadingComponentProps['query']} />
        ) : (
          props.isLoading
        )}
      </Match>
      <Match when={props.query.isError}>
        {typeof props.isError === 'function' ? (
          <props.isError query={props.query as IsErrorComponentProps['query']} />
        ) : (
          props.isError
        )}
      </Match>
      <Match when={props.query.isSuccess}>
        {typeof props.isSuccess === 'function' ? (
          <props.isSuccess query={props.query as IsSuccessComponentProps<TData>['query']} />
        ) : (
          props.isSuccess
        )}
      </Match>
    </Switch>
  );
};

export default InfiniteQuerySwitch;
