/*******************************************************************************
 * Copyright (c) 2011 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.rwt.internal;

import java.util.*;

import org.eclipse.rwt.internal.util.ClassUtil;
import org.eclipse.rwt.service.ISessionStore;


public class SingletonManager {

  private static final String ATTR_SINGLETON_MANAGER
    = SingletonManager.class.getName() + "#instance";

  public static void install( ISessionStore sessionStore ) {
    checkNotInstalled( sessionStore );
    sessionStore.setAttribute( ATTR_SINGLETON_MANAGER, new SingletonManager() );
  }

  public static SingletonManager getInstance( ISessionStore sessionStore ) {
    return ( SingletonManager )sessionStore.getAttribute( ATTR_SINGLETON_MANAGER );
  }
  
  private final Object lock;
  // Key: Class<T>, value: instance of T
  private final Map singletons;
  // Key: Class<T>, value: lock for T
  private final Map typeLocks;
  
  private SingletonManager() {
    lock = new Object();
    singletons = Collections.synchronizedMap( new HashMap() );
    typeLocks = new HashMap();
  }

  public Object getSingleton( Class type ) {
    synchronized( getTypeLock( type ) ) {
      Object result = singletons.get( type );
      if( result == null ) {
        result = ClassUtil.newInstance( type );
        singletons.put( type, result );
      }
      return result;
    }
  }
  
  private Object getTypeLock( Class type ) {
    synchronized( lock ) {
      Object result = typeLocks.get( type );
      if( result == null ) {
        result = new Object();
        typeLocks.put( type, result );
      }
      return result;
    }
  }

  private static void checkNotInstalled( ISessionStore sessionStore ) {
    if( getInstance( sessionStore ) != null ) {
      String msg = "SingletonManager already installed for session: " + sessionStore.getId();
      throw new IllegalStateException( msg );
    }
  }
}
