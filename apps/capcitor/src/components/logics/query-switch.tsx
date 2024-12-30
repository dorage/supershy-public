import {
  CreateQueryResult,
  QueryObserverLoadingErrorResult,
  QueryObserverLoadingResult,
  QueryObserverRefetchErrorResult,
  QueryObserverSuccessResult,
} from '@tanstack/solid-query';
import { Component, JSX, Match, Switch, createEffect } from 'solid-js';

export interface IsLoadingComponentProps {
  query: QueryObserverLoadingResult;
}

export interface IsErrorComponentProps {
  query: QueryObserverLoadingErrorResult | QueryObserverRefetchErrorResult;
}

export interface IsSuccessComponentProps<TData> {
  query: QueryObserverSuccessResult<TData>;
}

interface QuerySwitchProps<TData> {
  query: CreateQueryResult<TData>;
  isLoading?: JSX.Element | Component<IsLoadingComponentProps>;
  isError?: JSX.Element | Component<IsErrorComponentProps>;
  isSuccess?: JSX.Element | Component<IsSuccessComponentProps<TData>>;
}

const QuerySwitch = <TData,>(props: QuerySwitchProps<TData>) => {
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

export default QuerySwitch;
